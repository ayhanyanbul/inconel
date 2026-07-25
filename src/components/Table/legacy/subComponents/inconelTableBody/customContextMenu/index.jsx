import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { INCONELTABLE_MAIN_CLASSNAME } from '../../constants';

import { InconelTablePropsContext } from '../../contexts/InconelTablePropsContext';
import { getElementRect } from '../../utils';
import './customContextMenu.scss';

const CustomContextMenu = ({ target = null, posX = null, posY = null, closeAction = null, contentAction = null }) => {
  const { componentWidth } = useContext(InconelTablePropsContext);

  const [windowX, setWindowX] = useState(posX);
  const contextMenuRef = useRef(null);
  const contextEventTmo = useRef(0);

  const rootClassString = `${INCONELTABLE_MAIN_CLASSNAME}-custom-context-menu`;

  const handleCloseEvent = (e) => {
    if (!contextMenuRef.current.contains(e.target)) {
      closeAction();
    }
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
      {contentAction?.({ target, posX, posY })}
    </div>
  );
};

CustomContextMenu.propTypes = {
  target: PropTypes.object,
  posX: PropTypes.number,
  posY: PropTypes.number,
  closeAction: PropTypes.func,
  contentAction: PropTypes.func,
};

export default CustomContextMenu;
