import React, { useState, useCallback, useRef, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import { INCONELTABLE_MAIN_CLASSNAME, SELECTION_ALL, SELECTION_NONE } from '../../constants';

import { getElementRect, getTranslateInfo } from '../../utils';
import PinContextMenu from '../pinContextMenu';
import HeaderWrapper from './headerWrapper';
import { useInconelEffect } from '../../hooks/useInconelEffect';
import { InconelTablePropsContext } from '../../contexts/InconelTablePropsContext';

import './_tableHeader.scss';

const TableHeader = ({
  visibleColumns,
  tableContainerRef,
  elementPropsObject,
  leftIdList,
  centerIdList,
  rightIdList,
  groupBordersObject,
  headerHolderHeight,
  allColumnsHided,
  maxWidthAllowed,
}) => {
  const {
    mainComponentElement,
    columnOrderArray,
    pinLeftArray,
    pinRightArray,
    setInitialOptionStates,
    systemColumnsWidth,
    selection,
    totalDataLength,
  } = useContext(InconelTablePropsContext);

  const { setSelectedRows, multipleRowSelect, allItemsSelected, showCheckboxColumn, showSelectAll, enabled: selectionEnabled } = selection;

  const defaultPinContextMenuInfo = { x: 0, y: 0, id: null };
  const [pinContextMenuInfo, setPinContextMenuInfo] = useState({ ...defaultPinContextMenuInfo });

  const rootCls = `${INCONELTABLE_MAIN_CLASSNAME}-header`;
  let className = rootCls;
  className += allColumnsHided ? ` ${rootCls}-all-hided` : '';

  const selectAllCheckIsVisible = showCheckboxColumn && showSelectAll && selectionEnabled && multipleRowSelect && totalDataLength > 0;

  const dragInfoRef = useRef({ id: null, index: null, pinType: null });

  const [allowDrag, setAllowDrag] = useState(true);

  const isMounted = useRef(false);
  // ================================= DRAG & DROP ACTIONS =================================
  // =======================================================================================

  const getIndex = (id, pinType) => {
    let newList = [];

    if (pinType === 'left') {
      newList = [...leftIdList];
    } else if (pinType === 'right') {
      newList = [...rightIdList];
    } else {
      newList = [...centerIdList];
    }

    return newList.findIndex((listId) => listId === id);
  };

  const handleDragStart = (e, pinType) => {
    const targetTopId = e.currentTarget.getAttribute('data-inconeltable-id');

    const shadowDiv = createDragShadowDiv(targetTopId);
    const elmRect = getElementRect(e.currentTarget);

    e.dataTransfer.setDragImage(shadowDiv, e.clientX - elmRect.left, e.clientY - elmRect.top);

    dragInfoRef.current = { id: targetTopId, index: getIndex(targetTopId, pinType), pinType };
  };

  const handleDragEnter = (e, pinType) => {
    e.preventDefault();
    const targetTopId = e.currentTarget.getAttribute('data-inconeltable-id');
    const targetIndex = getIndex(targetTopId, pinType);
    const targetIsLocked = visibleColumns[targetTopId].locked;

    // console.log(dragInfoRef.current.index, targetIndex);

    if (dragInfoRef.current.index !== targetIndex && dragInfoRef.current.pinType === pinType && !targetIsLocked && allowDrag) {
      swapIds(dragInfoRef.current.index, targetIndex, pinType);

      dragInfoRef.current = { id: targetTopId, index: targetIndex, pinType };
      setAllowDrag(false);
    }
  };

  const handleDrop = (e) => {
    e.stopPropagation();
    removeDragShadowDiv();

    dragInfoRef.current = { id: null, index: null, pinType: null };
  };

  const swapIds = (startIndex, endIndex, pinState) => {
    let newList = [];
    let targetList = [];
    let stateKey = '';
    // columnOrderArray, pinLeftArray, pinRightArray
    if (pinState === 'left') {
      newList = [...leftIdList];
      targetList = [...pinLeftArray];
      stateKey = 'pinLeft';
    } else if (pinState === 'right') {
      newList = [...rightIdList];
      targetList = [...pinRightArray];
      stateKey = 'pinRight';
    } else {
      newList = [...centerIdList];
      targetList = [...columnOrderArray];
      stateKey = 'order';
    }

    const startValue = newList[startIndex];
    const endValue = newList[endIndex];

    const resultList = targetList.map((targetId) => {
      let newVal = targetId;
      if (String(newVal) === String(startValue)) {
        newVal = endValue;
      } else if (String(newVal) === String(endValue)) {
        newVal = startValue;
      }

      return newVal;
    });

    setInitialOptionStates(resultList, stateKey);
  };

  const createDragShadowDiv = useCallback(
    (colId) => {
      const tableMainElement = mainComponentElement.querySelector(`.${INCONELTABLE_MAIN_CLASSNAME}-table-container`);
      const groupIdList = visibleColumns[colId].groupFlatList;

      const mainCol = tableMainElement.querySelector(`.${rootCls}-item-id-${colId}`);
      const mainColTransform = getTranslateInfo(mainCol); // { x: 0, y: 0 }
      const mainColSizes = getHeaderSizes(colId); // {width: 579, height: 15}

      const shadowElm = document.createElement('div');
      shadowElm.className = `${INCONELTABLE_MAIN_CLASSNAME}-drag-shadow`;
      shadowElm.style.width = `${mainColSizes.width}px`;
      shadowElm.style.height = `${mainColSizes.height}px`;
      shadowElm.style.top = '-3000px';

      let subElm;
      let clonedElm;

      groupIdList.forEach((gid) => {
        subElm = tableMainElement.querySelector(`.${rootCls}-item-id-${gid}`);
        const subTransform = getTranslateInfo(subElm);

        clonedElm = subElm.cloneNode(true);

        clonedElm.style.transform = `translate(${subTransform.x - mainColTransform.x}px, ${subTransform.y - mainColTransform.y}px)`;
        shadowElm.appendChild(clonedElm);
      });

      tableMainElement.appendChild(shadowElm);

      return shadowElm;
    },
    [mainComponentElement, JSON.stringify(visibleColumns), JSON.stringify(elementPropsObject)],
  );

  const removeDragShadowDiv = useCallback(() => {
    const tableMainElement = mainComponentElement.querySelector(`.${INCONELTABLE_MAIN_CLASSNAME}-table-container`);
    const shadowElement = tableMainElement.querySelector(`.${INCONELTABLE_MAIN_CLASSNAME}-drag-shadow`);

    tableMainElement.removeChild(shadowElement);
  }, [mainComponentElement]);

  // =======================================================================================
  // ================================= DRAG & DROP ACTIONS =================================

  const handleContextPinMenu = (colId, mouseX, mouseY) => {
    const tableRect = getElementRect(tableContainerRef);

    setPinContextMenuInfo(() => ({ x: mouseX - tableRect.left, y: mouseY - tableRect.top, id: String(colId) }));
  };

  const getHeaderSizes = (headerId) => {
    const sizeObject = elementPropsObject[headerId]; // {width: 579, height: 15, maxWidth: null}
    const maxWidth = sizeObject?.maxWidth === undefined || sizeObject?.maxWidth === null ? null : sizeObject.maxWidth;

    return { width: maxWidth === null ? sizeObject.width : maxWidth, height: headerHolderHeight };
  };

  const getHeaderSection = (idList, type) => {
    // type 	-> left, right, center
    if (idList.length === 0) {
      return null;
    }

    return (
      <div className={`${rootCls}-${type}`}>
        <div className={`${rootCls}-${type}-content`}>
          <HeaderWrapper
            idList={idList}
            type={type}
            visibleColumns={visibleColumns}
            groupBordersObject={groupBordersObject}
            handleContextPinMenu={handleContextPinMenu}
            handleDragStart={handleDragStart}
            handleDragEnter={handleDragEnter}
            handleDrop={handleDrop}
            maxWidthAllowed={maxWidthAllowed}
          />
        </div>
      </div>
    );
  };

  useInconelEffect(() => {
    setTimeout(() => {
      if (isMounted.current) {
        setAllowDrag(true);
      }
    }, 250);
  }, [leftIdList, centerIdList, rightIdList]);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);
  /*
  useEffect(() => {
    setTimeout(() => {
      swapIds(4, 5);
    }, 2000);
	}, []);
	*/

  return (
    <>
      <div className={className}>
        {systemColumnsWidth > 0 && !allColumnsHided && (
          <div className={`${rootCls}-system`} style={{ width: `${systemColumnsWidth}px` }}>
            {selectAllCheckIsVisible && (
              <label className={`${rootCls}-system-check`}>
                <input
                  type="checkbox"
                  checked={allItemsSelected}
                  onChange={() => setSelectedRows({ type: allItemsSelected ? SELECTION_NONE : SELECTION_ALL })}
                />
              </label>
            )}
          </div>
        )}
        {getHeaderSection(leftIdList, 'left')}
        {getHeaderSection(centerIdList, 'center')}
        {getHeaderSection(rightIdList, 'right')}
      </div>
      {pinContextMenuInfo.id !== null && (
        <PinContextMenu
          id={pinContextMenuInfo.id}
          columnsObject={visibleColumns}
          posX={pinContextMenuInfo.x}
          posY={pinContextMenuInfo.y}
          pinLeftArray={leftIdList}
          pinRightArray={rightIdList}
          setInitialOptionStates={setInitialOptionStates}
          closeAction={() => {
            setPinContextMenuInfo(() => ({ ...defaultPinContextMenuInfo }));
          }}
        />
      )}
    </>
  );
};

TableHeader.propTypes = {
  visibleColumns: PropTypes.object,
  tableContainerRef: PropTypes.any,
  elementPropsObject: PropTypes.object,
  leftIdList: PropTypes.array,
  centerIdList: PropTypes.array,
  rightIdList: PropTypes.array,
  headerHolderHeight: PropTypes.number,
  groupBordersObject: PropTypes.object,
  allColumnsHided: PropTypes.bool,
  maxWidthAllowed: PropTypes.bool,
};

export default TableHeader;
