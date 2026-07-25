import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  INCONELTABLE_MAIN_CLASSNAME,
  INCONELTABLE_PIN_ACCESS_BOTH,
  INCONELTABLE_PIN_ACCESS_LEFT,
  INCONELTABLE_PIN_ACCESS_RIGHT,
} from '../../constants';

import { InconelTablePropsContext } from '../../contexts/InconelTablePropsContext';
import { getElementRect } from '../../utils';
import { useInconelMemo } from '../../hooks/useInconelMemo';
import './pinContextMenu.scss';

const PinContextMenu = (props) => {
  const { componentWidth, getLanguageText, columns } = useContext(InconelTablePropsContext);

  const { inconelMemo } = useInconelMemo();

  const { id, columnsObject, posX, posY, pinLeftArray, pinRightArray, setInitialOptionStates, closeAction } = props;

  const [windowX, setWindowX] = useState(posX);
  const contextMenuRef = useRef(null);
  const contextEventTmo = useRef(0);

  const rootClassString = `${INCONELTABLE_MAIN_CLASSNAME}-pin-context-menu`;

  const currentPinId = columnsObject[id].topElementId === null ? id : columnsObject[id].topElementId;
  const { pinAccess } = columnsObject[currentPinId];

  const [pinCanLeft, pinCanRight, pinCanRemove, pinCanAllRemove] = inconelMemo(
    () => {
      const isLeftPinned = pinLeftArray.find((ind) => String(ind) === String(currentPinId));
      const isRightPinned = pinRightArray.find((ind) => String(ind) === String(currentPinId));

      return [
        !isLeftPinned && (pinAccess === INCONELTABLE_PIN_ACCESS_LEFT || pinAccess === INCONELTABLE_PIN_ACCESS_BOTH),
        !isRightPinned && (pinAccess === INCONELTABLE_PIN_ACCESS_RIGHT || pinAccess === INCONELTABLE_PIN_ACCESS_BOTH),
        isLeftPinned || isRightPinned,
        pinLeftArray.length > 0 || pinRightArray.length > 0,
      ];
    },
    [currentPinId, pinAccess, pinLeftArray, pinRightArray],
    0,
  );

  const handleCloseEvent = (e) => {
    if (!contextMenuRef.current.contains(e.target)) {
      closeAction();
    }
  };

  const handleItemClick = (type) => {
    let newLeftList = [...pinLeftArray];
    let newRightList = [...pinRightArray];

    if (type === 'left') {
      newLeftList = [...newLeftList, currentPinId];
      newRightList = newRightList.filter((pid) => String(pid) !== String(currentPinId));
    } else if (type === 'right') {
      newRightList = [...newRightList, currentPinId];
      const lockedIdList = [];
      const freeIdList = [];

      newRightList.forEach((pid) => {
        if (columns?.[pid]?.locked) {
          lockedIdList.push(pid);
        } else {
          freeIdList.push(pid);
        }
      });
      newRightList = [...freeIdList, ...lockedIdList];

      newLeftList = newLeftList.filter((pid) => String(pid) !== String(currentPinId));
    } else if (type === 'clear') {
      newLeftList = newLeftList.filter((pid) => String(pid) !== String(currentPinId));
      newRightList = newRightList.filter((pid) => String(pid) !== String(currentPinId));
    } else if (type === 'clearAll') {
      newLeftList = newLeftList.filter((pid) => columns?.[pid]?.locked);
      newRightList = newRightList.filter((pid) => columns?.[pid]?.locked);
    }

    setInitialOptionStates(newLeftList, 'pinLeft');
    setInitialOptionStates(newRightList, 'pinRight');

    closeAction();
  };

  useLayoutEffect(() => {
    const contextMenuWidth = getElementRect(contextMenuRef.current).width;
    let resultX = posX + 3;
    resultX = resultX + contextMenuWidth > componentWidth ? posX - contextMenuWidth - 3 : resultX;

    setWindowX(() => resultX);
  }, [componentWidth, posX]);

  useEffect(() => {
    clearTimeout(contextEventTmo.current);
    document.removeEventListener('contextmenu', handleCloseEvent);
    document.removeEventListener('mousedown', handleCloseEvent);

    contextEventTmo.current = setTimeout(() => {
      document.addEventListener('contextmenu', handleCloseEvent);
      document.addEventListener('mousedown', handleCloseEvent);
    }, 10);

    return () => {
      clearTimeout(contextEventTmo.current);
      document.removeEventListener('contextmenu', handleCloseEvent);
      document.removeEventListener('mousedown', handleCloseEvent);
    };
  }, []);

  return (
    <div className={rootClassString} style={{ transform: `translate(${windowX}px, ${posY}px)` }} ref={contextMenuRef}>
      {pinCanLeft && (
        <div role="button" className={`${rootClassString}-item`} onClick={() => handleItemClick('left')}>
          {getLanguageText('pinLeft')}
        </div>
      )}
      {pinCanRight && (
        <div role="button" className={`${rootClassString}-item`} onClick={() => handleItemClick('right')}>
          {getLanguageText('pinRight')}
        </div>
      )}
      {pinCanRemove && (
        <div role="button" className={`${rootClassString}-item`} onClick={() => handleItemClick('clear')}>
          {getLanguageText('clearPin')}
        </div>
      )}
      {pinCanAllRemove && (
        <div role="button" className={`${rootClassString}-item`} onClick={() => handleItemClick('clearAll')}>
          {getLanguageText('clearAllPins')}
        </div>
      )}
    </div>
  );
};

PinContextMenu.propTypes = {
  id: PropTypes.string,
  columnsObject: PropTypes.object,
  posX: PropTypes.number,
  posY: PropTypes.number,
  pinLeftArray: PropTypes.array,
  pinRightArray: PropTypes.array,
  setInitialOptionStates: PropTypes.func,
  closeAction: PropTypes.func,
};

export default PinContextMenu;
