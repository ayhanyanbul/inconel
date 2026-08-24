import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './_inconelTableScroll.scss';
import { INCONELTABLE_THEME_DARK, INCONELTABLE_THEME_LIGHT } from '../constants';

const InconelTableScroll = forwardRef(
  (
    {
      id = null,
      className = null,
      isVertical = false,
      backgroundClassName = null,
      trackClassName = null,
      targetContainerSize = 0,
      targetContentSize = 0,
      width = null,
      height = null,
      onUpdate = null,
      minTrackSize = 20,
      expandSize = 12,
      wheelSize = 50,
      render = true,
      theme = INCONELTABLE_THEME_LIGHT,
    },
    ref,
  ) => {
    const [trackPosition, setTrackPosition] = useState(0);
    const [contentPosition, setContentPosition] = useState(0);
    const [isDrag, setIsDrag] = useState(0);

    const isMounted = useRef(false);
    const mainElementRef = useRef(null);
    const cursorPosition = useRef({ cx: 0, cy: 0 });
    const trackInlinePosition = useRef({ tx: 0, ty: 0 });

    const canExpand = expandSize > 0;
    const clsString = 'inconeltable-scroll';
    const directionClassString = !isVertical ? 'horizontal' : 'vertical';

    let clsName = className === null ? clsString : `${clsString} ${className}`;
    clsName += ` ${clsString}-${theme}`;
    clsName += ` ${clsString}-${directionClassString}`;
    clsName += canExpand ? ` ${clsString}-expandable` : '';

    const bgClsName = backgroundClassName === null ? `${clsString}-bg-holder` : `${clsString}-bg-holder ${backgroundClassName}`;
    let trackClsName = trackClassName === null ? `${clsString}-track` : `${clsString}-track ${trackClassName}`;
    trackClsName += isDrag ? ` ${clsString}-drag` : '';

    let propWidth = width;
    let propHeight = height;

    if (propWidth === null) {
      propWidth = isVertical ? 6 : 100;
    }

    if (propHeight === null) {
      propHeight = isVertical ? 100 : 6;
    }

    const containerWidth = isVertical && canExpand ? expandSize : propWidth;
    const containerHeight = !isVertical && canExpand ? expandSize : propHeight;

    const [maxContentValue, setMaxContentValue] = useState(null);
    const trackSize = useRef(null);
    const maxTrackPosition = useRef(null);

    useEffect(() => {
      const scrollBgSize = isVertical ? propHeight : propWidth;
      const contentRatio = targetContainerSize / targetContentSize;

      let newTrackSize = scrollBgSize * contentRatio;
      newTrackSize = newTrackSize < minTrackSize && minTrackSize < scrollBgSize - 10 ? minTrackSize : newTrackSize;

      maxTrackPosition.current = scrollBgSize - newTrackSize;
      trackSize.current = newTrackSize;

      setMaxContentValue(() => targetContentSize - targetContainerSize);
    }, [targetContentSize, targetContainerSize, isVertical, propHeight, propWidth, minTrackSize]);

    const getClientPositions = (e) => {
      const clientX = e?.touches !== undefined ? e.touches[0].clientX : e.clientX;
      const clientY = e?.touches !== undefined ? e.touches[0].clientY : e.clientY;

      return { clientX, clientY };
    };

    const getTrackStyle = () => {
      const result = !isVertical
        ? { width: `${trackSize.current}px`, minHeight: `${propHeight}px`, transform: `translateX(${trackPosition}px)` }
        : { height: `${trackSize.current}px`, minWidth: `${propWidth}px`, transform: `translateY(${trackPosition}px)` };

      return result;
    };

    const handleWheel = (e) => {
      e.stopPropagation();

      const valChange = e.deltaY > 0 ? wheelSize : -wheelSize;

      updateContentPosition(contentPosition + valChange, true);
    };

    const handleBackgroundClick = (e) => {
      e.stopPropagation();

      const { clientX, clientY } = getClientPositions(e);
      const targetElm = e.currentTarget;
      const parentElm = targetElm.parentNode;

      const parentRect = parentElm.getBoundingClientRect();
      const parentVal = !isVertical ? parentRect.left : parentRect.top;

      const pointVal = !isVertical ? clientX - parentVal : clientY - parentVal;

      updateTrackPosition(pointVal, true);
    };

    const handleMouseDown = (e) => {
      e.stopPropagation();

      const { clientX, clientY } = getClientPositions(e);
      window.getSelection().removeAllRanges();

      const mainRect = mainElementRef.current.getBoundingClientRect();
      cursorPosition.current = { cx: mainRect.left, cy: mainRect.top };

      const targetRect = e.currentTarget.getBoundingClientRect();
      trackInlinePosition.current = { tx: clientX - targetRect.left, ty: clientY - targetRect.top };

      window.addEventListener('mousemove', handleMouseMove, { capture: false, passive: false });
      window.addEventListener('touchmove', handleMouseMove, { capture: false, passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);

      setIsDrag(true);
    };

    const handleMouseMove = (e) => {
      e.stopPropagation();
      e.preventDefault();

      window.getSelection().removeAllRanges();
      const { clientX, clientY } = getClientPositions(e);
      const { cx, cy } = cursorPosition.current;
      const { tx, ty } = trackInlinePosition.current;

      const pos = !isVertical ? clientX - cx - tx : clientY - cy - ty;
      // console.log(clientX, cx, tx);

      window.requestAnimationFrame(() => {
        updateTrackPosition(pos, true);
      });
    };

    const handleMouseUp = (e) => {
      e.stopPropagation();

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);

      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);

      if (isMounted.current) {
        setIsDrag(false);
      }
    };

    const updateTrackPosition = (val, isMouse) => {
      if (isMounted.current) {
        val = val < 0 ? 0 : val;
        val = val > maxTrackPosition.current ? maxTrackPosition.current : val;

        if (isMouse && onUpdate !== null) {
          const newScrollRatio = val / (maxTrackPosition.current === 0 ? 1 : maxTrackPosition.current);
          const newContentPosition = newScrollRatio * maxContentValue;

          window.requestAnimationFrame(() => {
            if (isMounted.current) {
              setContentPosition(newContentPosition);
              onUpdate(newContentPosition);
            }
          });
        }

        window.requestAnimationFrame(() => {
          if (isMounted.current) {
            setTrackPosition(val);
          }
        });
      }
    };

    const updateContentPosition = (val, isMouse) => {
      let newContentPosition = val < 0 ? 0 : val;
      newContentPosition = newContentPosition > maxContentValue ? maxContentValue : newContentPosition;

      const newContentRatio = newContentPosition / maxContentValue;
      const newTrackPosition = maxTrackPosition.current * newContentRatio;

      if (isMouse && onUpdate !== null) {
        onUpdate(newContentPosition);
      }

      setContentPosition(newContentPosition);
      setTrackPosition(newTrackPosition);
    };

    useImperativeHandle(ref, () => ({
      setTrackPosition: (val) => {
        if (isMounted.current) {
          updateTrackPosition(val, false);
        }
      },

      setContentPosition: (val) => {
        if (isMounted.current) {
          updateContentPosition(val, false);
        }
      },

      getPositions: () => ({ trackPosition, contentPosition }),
    }));

    useEffect(() => {
      if (isVertical) {
        let isMouse = false;
        let newContentRatio = contentPosition / maxContentValue;
        if (newContentRatio > 1) {
          // içerik kısalmış
          newContentRatio = 1;
          isMouse = true;
        }

        const newTrackPosition = maxTrackPosition.current * newContentRatio;

        updateTrackPosition(newTrackPosition, isMouse);
      }
    }, [targetContentSize, targetContainerSize, containerWidth, containerHeight, maxContentValue]);

    useEffect(() => {
      isMounted.current = true;

      return () => {
        isMounted.current = false;
      };
    }, []);

    if (!render || maxContentValue === null || maxContentValue <= 0) {
      return null;
    }

    return (
      <div
        id={id}
        className={clsName}
        style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
        ref={mainElementRef}
        onWheel={isVertical && wheelSize > 0 ? handleWheel : null}
      >
        <div role="button" className={bgClsName} onClick={handleBackgroundClick}>
          <div style={{ width: `${propWidth}px`, height: `${propHeight}px` }} />
        </div>
        <div role="button" className={trackClsName} style={getTrackStyle()} onMouseDown={handleMouseDown} onTouchStart={handleMouseDown} />
      </div>
    );
  },
);

InconelTableScroll.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  isVertical: PropTypes.bool,
  backgroundClassName: PropTypes.string,
  trackClassName: PropTypes.string,
  targetContainerSize: PropTypes.number.isRequired,
  targetContentSize: PropTypes.number.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onUpdate: PropTypes.func,
  minTrackSize: PropTypes.number,
  expandSize: PropTypes.number,
  wheelSize: PropTypes.number,
  render: PropTypes.bool,
  theme: PropTypes.oneOf([INCONELTABLE_THEME_LIGHT, INCONELTABLE_THEME_DARK]),
};

export default InconelTableScroll;
