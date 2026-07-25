/* eslint-disable no-underscore-dangle */
import { useRef, useState, useLayoutEffect, useContext, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VariableSizeList as List } from 'react-window';
import cloneDeep from 'lodash/cloneDeep';

import { debounce } from 'lodash';
import { isValidVariable } from 'utils/helpers';
import { INCONELTABLE_MAIN_CLASSNAME } from '../constants';
import { getDataOrderIds, getVisibleColumns, itemIsGroup, getElementRect, touchIsSupported } from '../utils';

import FilterWindow from './filterWindow';
import TableFooter from './tableFooter';
import TableHeader from './tableHeader';

import InconelTablePagination from '../inconelTablePagination';

import { useInconelMemo } from '../hooks/useInconelMemo';
import { useInconelEffect } from '../hooks/useInconelEffect';
import InconelTableScroll from '../inconelTableScroll';
import { InconelTablePropsContext } from '../contexts/InconelTablePropsContext';
import { calculateTableDom } from './tableCalculations';
import RowWrapper from './rowItem/rowWrapper';
// import { measureSizes } from '../measureSizes';

import './_inconelTableBody.scss';

const InconelTableBody = ({ rowStartIndex, tableResetIndex, tableResetVerticalScroll, setTableResetIndex, setTableResetVerticalScroll }) => {
  const { inconelMemo } = useInconelMemo();
  const {
    mainComponentElement,
    showData,
    columns,
    maxLevel,
    columnOrderArray,
    pinLeftArray,
    pinRightArray,
    hideArray,
    sorting,
    filtering,
    autoResizeColumns,
    showGroupBorders,
    componentWidth,
    headerHeight,
    cellHeight,
    equalRowHeight,
    cellPadding,
    headerPadding,
    pageSize,
    // fontFamily,
    // fontSize,
    // accordion,
    tableHeight,
    theme,
    systemColumnsWidth,

    pagination,
    totalDataLength,
    showedDataLength,
    fullData,
    getLanguageText,
    updatedRowsObject,
    resetUpdatedRowsObject,
    updateEffect,
    footerIsEnabled,
    setHorizontalScrollVisible,
    customFooterHeight,
  } = useContext(InconelTablePropsContext);

  const { colList: sortingColList } = sorting;
  const { filterWindowId, customFilterFunction, colList: filteringColList, enabled: filteringEnabled } = filtering;
  // const { customHeight: accordionCustomHeight } = accordion;

  const rootCls = INCONELTABLE_MAIN_CLASSNAME;
  const touchIsExist = touchIsSupported();

  // silinebilir

  const tableMinWidth = 200;
  const [contentWidthForNoResize, setContentWidthForNoResize] = useState(tableMinWidth);
  const [verticolScrollUpdateCount, setVerticolScrollUpdateCount] = useState(0);
  const verticalScrollUpdateRef = useRef(0);

  const minTableHolderHeight = inconelMemo(() => pageSize.rowCount * cellHeight, [pageSize.rowCount, cellHeight], 0);
  // silinebilir

  const [elementPropsObject, setElementPropsObject] = useState({}); // { 1:{width: 87, height: 15, maxWidth: null} }

  const [refreshCount, setRefreshCount] = useState(0);
  const [tableSectionSizes, setTableSectionSizes] = useState({
    rightContentWidth: 0,
    rightHolderWidth: 0,
    centerContentWidth: 0,
    centerHolderWidth: 0,
    leftContentWidth: 0,
    leftHolderWidth: 0,
    headerHolderHeight: 0,
  });

  const tableSectionSizesRef = useRef({
    rightContentWidth: 0,
    rightHolderWidth: 0,
    centerContentWidth: 0,
    centerHolderWidth: 0,
    leftContentWidth: 0,
    leftHolderWidth: 0,
    headerHolderHeight: 0,
  });

  const [filterWindowPositionX, setFilterWindowPositionX] = useState(null);

  const tableWidth =
    tableSectionSizes.rightHolderWidth + tableSectionSizes.centerHolderWidth + tableSectionSizes.leftHolderWidth + systemColumnsWidth;

  const isMounted = useRef(false);
  const firstLoad = useRef(true);
  const tableContainerRef = useRef(null);
  const tableRef = useRef(null);
  const scrollRef = useRef(null);
  const tableBodyRef = useRef(null);
  const timeoutRef = useRef(0);

  const leftHorizontalScrollExist = tableSectionSizes.leftContentWidth > tableSectionSizes.leftHolderWidth;
  const centerHorizontalScrollExist = tableSectionSizes.centerContentWidth > tableSectionSizes.centerHolderWidth;
  const rightHorizontalScrollExist = tableSectionSizes.rightContentWidth > tableSectionSizes.rightHolderWidth;

  const leftScrollRef = useRef(null);
  const centerScrollRef = useRef(null);
  const rightScrollRef = useRef(null);
  const clearUpdateEffectRef = useRef(0);

  const defaultHorizontalScrolls = { left: 0, center: 0, right: 0 };
  const horizontalScrolls = useRef({ ...defaultHorizontalScrolls });

  const columnWidthList = useRef({}); // 0: 45, 1: 32, 3:45
  const rowHeightCache = useRef(showData.map(() => cellHeight)); // 30, 30, 30
  const tableContentHeight = useRef(showData.length * cellHeight);

  const tableShowedHeight = pageSize?.displayedRowCount ? pageSize.displayedRowCount * cellHeight : tableHeight;

  /*
  const horizontalScrollVisible =
    totalDataLength !== 0 && (leftHorizontalScrollExist || centerHorizontalScrollExist || rightHorizontalScrollExist);
	*/
  const horizontalScrollVisible = leftHorizontalScrollExist || centerHorizontalScrollExist || rightHorizontalScrollExist;

  const [visibleColumns, maxWidthAllowed] = inconelMemo(() => getVisibleColumns(cloneDeep(columns), hideArray), [columns, hideArray], 2);

  const allColumnsHided = Object.keys(visibleColumns).length === 0;

  const [horizontalScrollRenderCount, setHorizontalScrollRenderCount] = useState(0);
  const verticalScrollPosition = useRef(0);
  const maxVscrollValue = useRef(0);
  const vScrollActiveRef = useRef(false);
  const [verticalScrollActive, setVerticalScrollActive] = useState(false);
  const [vscrollUpdateCount, setVscrollUpdateCount] = useState(0);
  const tableHeightTotal = useRef(0);

  const updateScr = useCallback(
    debounce(() => {
      if (isMounted.current) {
        setVscrollUpdateCount((old) => old + 1);
      }
    }, 200),
    [],
  );

  useInconelEffect(() => {
    setTimeout(() => {
      if (isMounted.current) {
        const maxScrollSize = tableContentHeight.current - tableShowedHeight;
        // console.log('max', tableContentHeight.current, tableShowedHeight);
        const vsActive = totalDataLength > 0 && !allColumnsHided && maxScrollSize > 0;
        maxVscrollValue.current = vsActive ? maxScrollSize : 0;
        tableHeightTotal.current = tableShowedHeight;

        vScrollActiveRef.current = vsActive;

        setVerticalScrollActive(() => vsActive);
      }
    }, 300);
  }, [vscrollUpdateCount, tableShowedHeight]);

  const resetHorizontalScrolls = () => {
    horizontalScrolls.current = { ...defaultHorizontalScrolls };
    applyHorizontalScrollValues();
    setHorizontalScrollRenderCount((old) => old + 1);
  };

  const getNoDataJsx = () => {
    let warnText = null;

    if (totalDataLength === 0) {
      warnText = getLanguageText('noData');
    } else if (filteringEnabled && fullData && customFilterFunction === null && showedDataLength === 0) {
      warnText = getLanguageText('filterNoData');
    }

    if (warnText === null || !pageSize?.addMissingRows) {
      return null;
    }

    return (
      <div className={`${rootCls}-nodata`}>
        <div>{warnText}</div>
      </div>
    );
  };

  /*
  const setColumnWidthList = (newList) => {
    columnWidthList.current = { ...newList };
  };

  const setRowHeightCacheByIndex = (ind, val) => {
    const newCache = [...rowHeightCache.current];
    newCache[ind] = val;

    rowHeightCache.current = newCache;
    tableContentHeight.current = newCache.reduce((acc, total) => acc + total, 0);

    updateScr();
  };
*/

  const [leftIdList, centerIdList, rightIdList, leftColList, centerColList, rightColList] = inconelMemo(
    () => {
      const colKeyList = Object.keys(visibleColumns);
      const newLeftIdList = [];
      const newRightIdList = [];
      const newLeftColList = [];
      const newCenterColList = [];
      const newRightColList = [];

      let newCenterIdList = columnOrderArray.map((item) => String(item)).filter((cId) => colKeyList.includes(cId));

      pinLeftArray.forEach((subId) => {
        if (colKeyList.includes(String(subId))) {
          newLeftIdList.push(subId);
          newCenterIdList = newCenterIdList.filter((cId) => String(cId) !== String(subId));
        }
      });

      pinRightArray.forEach((subId) => {
        if (colKeyList.includes(String(subId))) {
          newRightIdList.push(subId);
          newCenterIdList = newCenterIdList.filter((cId) => String(cId) !== String(subId));
        }
      });

      newLeftIdList.forEach((item) => {
        newLeftColList.push(...getDataOrderIds(item, visibleColumns));
      });

      newCenterIdList.forEach((item) => {
        newCenterColList.push(...getDataOrderIds(item, visibleColumns));
      });

      newRightIdList.forEach((item) => {
        newRightColList.push(...getDataOrderIds(item, visibleColumns));
      });

      return [newLeftIdList, newCenterIdList, newRightIdList, newLeftColList, newCenterColList, newRightColList];
    },
    [pinLeftArray, pinRightArray, visibleColumns, columnOrderArray],
    3,
  );

  const getGroupBorderObject = (idList, visibleCols) => {
    if (!Array.isArray(idList)) {
      return {};
    }

    const result = {};

    idList.forEach((colId, index) => {
      const nextColId = idList?.[index + 1] ?? null;

      let showBorder = itemIsGroup(colId) || itemIsGroup(nextColId);
      showBorder = index === idList.length - 1 ? false : showBorder;

      if (showBorder) {
        Object.values(visibleCols[colId].groupIdList).forEach((subGroupList) => {
          const lastElm = subGroupList?.[subGroupList.length - 1] ?? null;

          result[lastElm] = true;
        });
      }
    });

    return result;
  };

  const groupBordersObject = inconelMemo(
    () => {
      let result = {};

      if (!showGroupBorders) {
        return result;
      }

      result = { ...result, ...getGroupBorderObject(leftIdList, visibleColumns) };
      result = { ...result, ...getGroupBorderObject(rightIdList, visibleColumns) };
      result = { ...result, ...getGroupBorderObject(centerIdList, visibleColumns) };

      return result;
    },
    [leftIdList, centerIdList, rightIdList, visibleColumns, showGroupBorders],
    4,
  );

  // end memoized values

  const getHorizontalScrollBars = () => {
    const { leftHolderWidth, leftContentWidth, centerHolderWidth, centerContentWidth, rightHolderWidth, rightContentWidth } =
      tableSectionSizes;

    return (
      <div className={`${rootCls}-horizontal-scroll-holder`} key={horizontalScrollRenderCount}>
        {leftHorizontalScrollExist && (
          <div className={`${rootCls}-horizontal-scroll-item`} style={{ transform: `translateX(${systemColumnsWidth}px)` }}>
            <InconelTableScroll
              width={leftHolderWidth}
              targetContainerSize={leftHolderWidth}
              targetContentSize={leftContentWidth}
              onUpdate={(val) => {
                updateHorizontalScrollValue('left', val);
              }}
              theme={theme}
              ref={leftScrollRef}
            />
          </div>
        )}
        {centerHorizontalScrollExist && (
          <div
            className={`${rootCls}-horizontal-scroll-item`}
            style={{ transform: `translateX(${systemColumnsWidth + leftHolderWidth}px)` }}
          >
            <InconelTableScroll
              width={centerHolderWidth}
              targetContainerSize={centerHolderWidth}
              targetContentSize={centerContentWidth}
              onUpdate={(val) => {
                updateHorizontalScrollValue('center', val);
              }}
              theme={theme}
              ref={centerScrollRef}
            />
          </div>
        )}
        {rightHorizontalScrollExist && (
          <div
            className={`${rootCls}-horizontal-scroll-item`}
            style={{
              transform: `translateX(${systemColumnsWidth + leftHolderWidth + centerHolderWidth}px)`,
            }}
          >
            <InconelTableScroll
              width={rightHolderWidth}
              targetContainerSize={rightHolderWidth}
              targetContentSize={rightContentWidth}
              onUpdate={(val) => {
                updateHorizontalScrollValue('right', val);
              }}
              theme={theme}
              ref={rightScrollRef}
            />
          </div>
        )}
      </div>
    );
  };

  const applyHorizontalScrollValues = (type = null) => {
    if (mainComponentElement === null) {
      return false;
    }

    const sectionsList = type === null ? ['left', 'center', 'right'] : [type];

    sectionsList.forEach((sec) => {
      const elmList = mainComponentElement.querySelectorAll(`.${INCONELTABLE_MAIN_CLASSNAME}-row-item-${sec}`);
      elmList.forEach((elm) => {
        elm.scrollLeft = horizontalScrolls.current[sec];
      });

      const headerElm = mainComponentElement.querySelector(`.${INCONELTABLE_MAIN_CLASSNAME}-header-${sec}`);
      if (headerElm !== null) {
        headerElm.scrollLeft = horizontalScrolls.current[sec];
      }

      const footerElm = mainComponentElement.querySelector(`.${INCONELTABLE_MAIN_CLASSNAME}-footer-${sec}`);
      if (footerElm !== null) {
        footerElm.scrollLeft = horizontalScrolls.current[sec];
      }
    });

    return true;
  };

  const updateHorizontalScrollValue = (type, val) => {
    const { leftContentWidth, leftHolderWidth, centerContentWidth, centerHolderWidth, rightContentWidth, rightHolderWidth } =
      tableSectionSizesRef.current;

    let maxVal = 0;
    let currentVal = 0;

    switch (type) {
      case 'left':
        maxVal = leftContentWidth - leftHolderWidth;
        currentVal = horizontalScrolls.current.left;
        break;
      case 'center':
        maxVal = centerContentWidth - centerHolderWidth;
        currentVal = horizontalScrolls.current.center;
        break;
      case 'right':
        maxVal = rightContentWidth - rightHolderWidth;
        currentVal = horizontalScrolls.current.right;
        break;
      default:
        maxVal = 0;
    }

    val = val > maxVal ? maxVal : val;
    val = val < 0 ? 0 : val;

    if (val !== currentVal) {
      horizontalScrolls.current = { ...horizontalScrolls.current, [type]: val };
      applyHorizontalScrollValues(type);
    }
  };

  const applyVerticalScrollValue = (val) => {
    val = val < 0 ? 0 : val;
    val = val > maxVscrollValue.current ? maxVscrollValue.current : val;

    // if (verticalScrollPosition.current !== val) {
    tableRef?.current?.scrollTo(val);

    if (scrollRef.current !== null && vScrollActiveRef.current) {
      scrollRef.current.setContentPosition(val);
      verticalScrollPosition.current = val;

      clearTimeout(verticalScrollUpdateRef.current);
      verticalScrollUpdateRef.current = setTimeout(() => {
        setVerticolScrollUpdateCount((old) => old + 1);
      }, 10);
    }
    // }
  };

  const handleWheel = useCallback((e) => {
    e.stopPropagation();

    if (e.cancelable) {
      e.preventDefault();
    }

    const { deltaY } = e;
    let scrollVal = tableRef?.current?._outerRef.scrollTop;
    scrollVal += deltaY > 0 ? 100 : -100;

    applyVerticalScrollValue(scrollVal);
  }, []);

  // const allColumnList = inconelMemo(() => [...leftColList, ...centerColList, ...rightColList], [leftColList, centerColList, rightColList], 0);

  const calculateRowHeight = (rowIndex) => cellHeight;
  /*
  const calculateRowHeight = (rowIndex) => {
    // console.log('calc : ', rowIndex);
    const rowData = showData[rowIndex];

    // const rowNumber = rowData === null ? rowIndex : rowData[INCONELTABLE_ROW_INDEX];
    const accordionIsCustom = rowData?.[INCONELTABLE_ROW_ACCORDION_CUSTOM];

    const currentRowHeight = isValidVariable(rowHeightCache.current[rowIndex])
      ? rowHeightCache.current[rowIndex]
      : cellHeight;

    let colSizeIsUpdated = false;
    let resultHeight = currentRowHeight;

    if (accordionIsCustom) {
      resultHeight = accordionCustomHeight;
    } else {
      allColumnList.forEach((colId) => {
        const currentWidthList = columnWidthList.current;
        const colWidth = currentWidthList[colId] === undefined ? 0 : currentWidthList[colId];
        const { minWidth, renderAsHTML } = columns[colId];
        const maxWidth = maxWidthAllowed ? columns[colId]?.maxWidth : null;
        // const cellString = getValueFromSource({ source: rowData, path: dataKey });
        const cellString = isValidVariable(rowData?.[INCONELTABLE_ROW_TEXTS]?.[colId])
          ? rowData[INCONELTABLE_ROW_TEXTS][colId]
          : null;

        const maxWidthForMeasure = maxWidth === null ? null : maxWidth - cellPadding.horizontal;

        // if (cellString !== null) {
        let { elmWidth, elmHeight } = measureSizes({
          cellString,
          renderAsHTML,
          fontFamily,
          fontSize,
          minWidth,
          maxWidth: maxWidthForMeasure,
        });
        elmHeight += cellPadding.vertical;

        elmHeight = elmHeight < cellHeight ? cellHeight : elmHeight;

        // console.log(elmWidth, minWidth, maxWidth);
        elmWidth += cellPadding.horizontal;
        elmWidth = minWidth !== null ? Math.max(elmWidth, minWidth) : elmWidth;
        elmWidth = maxWidth !== null ? Math.min(elmWidth, maxWidth) : elmWidth;

        if (colWidth < elmWidth && currentWidthList[colId] !== undefined) {
          colSizeIsUpdated = true;
        }

        // console.log(rowIndex, currentRowHeight, elmHeight);
        resultHeight = Math.max(resultHeight, elmHeight);

        setColumnWidthList({ ...currentWidthList, [colId]: Math.max(colWidth, elmWidth) });
        // }
      });
    }

    const heightChangeAmount = resultHeight - currentRowHeight;

    if (heightChangeAmount > 0) {
      colSizeIsUpdated = true;
      tableContentHeight.current += heightChangeAmount;
    }

    setRowHeightCacheByIndex(rowIndex, resultHeight);

    if (colSizeIsUpdated) {
      updateRefreshCount();
    }

    return resultHeight;
  };
	*/

  const scrollRefPosition = useRef({ x: 0, y: 0 });
  const touchStartPosition = useRef({ x: 0, y: 0 });
  const touchRegion = useRef(null); // left, center, right

  const handleTouchStart = useCallback(
    (e) => {
      const tgt = e.target;
      let startRegion = null; // left, right, center
      let startX = 0;

      if (startRegion === null && leftHorizontalScrollExist) {
        mainComponentElement.querySelectorAll('.inconeltable-row-item-left').forEach((rowElm) => {
          if (rowElm.contains(tgt)) {
            startRegion = 'left';
            startX = horizontalScrolls.current.left;
          }
        });
      }

      if (startRegion === null && centerHorizontalScrollExist) {
        mainComponentElement.querySelectorAll('.inconeltable-row-item-center').forEach((rowElm) => {
          if (rowElm.contains(tgt)) {
            startRegion = 'center';
            startX = horizontalScrolls.current.center;
          }
        });
      }

      if (startRegion === null && rightHorizontalScrollExist) {
        mainComponentElement.querySelectorAll('.inconeltable-row-item-right').forEach((rowElm) => {
          if (rowElm.contains(tgt)) {
            startRegion = 'right';
            startX = horizontalScrolls.current.right;
          }
        });
      }

      scrollRefPosition.current = { x: startX, y: tableRef?.current?._outerRef?.scrollTop };
      touchRegion.current = startRegion;
      touchStartPosition.current = { x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY };
    },
    [leftHorizontalScrollExist, centerHorizontalScrollExist, rightHorizontalScrollExist, tableSectionSizes],
  );

  const handleTouchMove = useCallback((e) => {
    e.stopPropagation();
    if (e.cancelable) {
      e.preventDefault();
    }

    const moveX = touchStartPosition.current.x - e.changedTouches[0].screenX;
    const moveY = touchStartPosition.current.y - e.changedTouches[0].screenY;

    if (vScrollActiveRef.current) {
      applyVerticalScrollValue(scrollRefPosition.current.y + moveY);
    }

    if (touchRegion.current !== null) {
      // console.log('change', scrollRefPosition.current.x + moveX);
      updateHorizontalScrollValue(touchRegion.current, scrollRefPosition.current.x + moveX);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    // tableBodyRef.current.removeEventListener('touchmove', handleTouchMove, { capture: false, passive: false });
    // tableBodyRef.current.removeEventListener('touchend', handleTouchEnd, { capture: false, passive: false });
  }, []);

  useEffect(() => {
    /*
    console.log(showData, touchIsExist);
    console.log(
      leftHorizontalScrollExist,
      centerHorizontalScrollExist,
      rightHorizontalScrollExist,
      verticalScrollActive
    );
    console.log('=====================');
		*/

    if (
      showData?.some((item) => isValidVariable(item)) &&
      touchIsExist &&
      (leftHorizontalScrollExist || centerHorizontalScrollExist || rightHorizontalScrollExist || verticalScrollActive)
    ) {
      tableBodyRef.current.addEventListener('touchmove', handleTouchMove, { capture: false, passive: false });
      tableBodyRef.current.addEventListener('touchend', handleTouchEnd, { capture: false, passive: false });
    } else {
      tableBodyRef.current.removeEventListener('touchmove', handleTouchMove, { capture: false, passive: false });
      tableBodyRef.current.removeEventListener('touchend', handleTouchEnd, { capture: false, passive: false });
    }
  }, [leftHorizontalScrollExist, centerHorizontalScrollExist, rightHorizontalScrollExist, verticalScrollActive, touchIsExist, showData]);

  useInconelEffect(() => {
    const verticalScrollElm = tableBodyRef.current;

    verticalScrollElm.removeEventListener('wheel', handleWheel, { capture: false, passive: false });
    verticalScrollElm.removeEventListener('touchstart', handleTouchStart, { capture: false, passive: false });

    if (verticalScrollActive && !touchIsExist) {
      verticalScrollElm.addEventListener('wheel', handleWheel, { capture: false, passive: false });
    }

    if (touchIsExist && (verticalScrollActive || leftHorizontalScrollExist || centerHorizontalScrollExist || rightHorizontalScrollExist)) {
      verticalScrollElm.addEventListener('touchstart', handleTouchStart, { capture: false, passive: false });
    }
  }, [verticalScrollActive, leftHorizontalScrollExist, centerHorizontalScrollExist, rightHorizontalScrollExist, touchIsExist]);

  // layout effect

  useLayoutEffect(() => {
    const effectFunc = () => {
      let propsObject = null;
      let tableSections = null;
      let calculationResult = null;
      let generalTableWidth = 0;

      const calculateTableSizes = (customWidth = null, resize = true) => {
        const propList = {
          mainComponentElement,
          visibleColumns,
          leftIdList,
          centerIdList,
          rightIdList,
          componentWidth,
          autoResizeColumns: resize,
          maxLevel,
          headerHeight,
          cellHeight,
          equalRowHeight,
          footerIsEnabled,
          cellPadding,
          headerPadding,
          sortingColList,
          filteringColList,
          systemColumnsWidth,
          colWidthList: columnWidthList.current,
          customFooterHeight,
        };

        if (customWidth !== null) {
          propList.componentWidth = customWidth;
        }

        return calculateTableDom(propList);
      };

      const generalTableCalc = (sections) => {
        const { leftHolderWidth, centerHolderWidth, rightHolderWidth } = sections;
        let total = leftHolderWidth + centerHolderWidth + rightHolderWidth + systemColumnsWidth;

        total = total > contentWidthForNoResize ? total : contentWidthForNoResize;
        total = total < tableMinWidth ? tableMinWidth : total;
        total = total > componentWidth ? componentWidth : total;

        return total;
      };

      calculationResult = calculateTableSizes(null, autoResizeColumns);
      if (calculationResult !== null) {
        propsObject = calculationResult.elementPropsObject;
        tableSections = calculationResult.tableSectionSizes;
        generalTableWidth = generalTableCalc(tableSections);

        // console.log('tab', calculationResult.tableSectionSizes);

        if (!autoResizeColumns) {
          calculationResult = calculateTableSizes(generalTableWidth, true);
          propsObject = calculationResult.elementPropsObject;
          tableSections = calculationResult.tableSectionSizes;
          generalTableWidth = generalTableCalc(tableSections);

          const frameContainer = mainComponentElement.querySelector(`.${rootCls}-frame`);
          if (frameContainer !== null) {
            frameContainer.style.width = `${generalTableWidth}px`;
          }
          setContentWidthForNoResize(generalTableWidth);
        }

        setElementPropsObject(() => ({ ...propsObject }));

        tableSectionSizesRef.current = { ...tableSectionSizesRef.current, ...tableSections };
        setTableSectionSizes((oldValues) => ({ ...oldValues, ...tableSections }));
      }
    };

    effectFunc();

    clearTimeout(timeoutRef.current);

    if (footerIsEnabled) {
      timeoutRef.current = setTimeout(() => {
        effectFunc();
      }, 100);
    }
  }, [
    JSON.stringify(showData),
    componentWidth,
    minTableHolderHeight,
    columnOrderArray,
    pinLeftArray,
    pinRightArray,
    hideArray,
    refreshCount,
    systemColumnsWidth,
    horizontalScrollVisible,
    footerIsEnabled,
    verticolScrollUpdateCount,
    customFooterHeight,
  ]);
  // layout effect

  useInconelEffect(() => {
    setHorizontalScrollVisible(horizontalScrollVisible);
  }, [horizontalScrollVisible]);

  useInconelEffect(() => {
    if (isMounted.current) {
      if (tableResetVerticalScroll && !updateEffect) {
        setTableResetVerticalScroll(false);

        setTimeout(() => {
          if (isMounted.current && scrollRef.current !== null && verticalScrollActive) {
            scrollRef.current.setTrackPosition(0);
            scrollRef.current.setContentPosition(0);
          }
        }, 300);

        tableRef?.current?.scrollTo(0);
      }

      const defIndex = tableResetIndex === null && showData.length !== rowHeightCache.current.length ? 0 : tableResetIndex;

      if (defIndex !== null) {
        const currentHeightCache = [...rowHeightCache.current];

        let newHeightCache = [];

        if (defIndex === 0) {
          newHeightCache = Array(showData.length).fill(cellHeight);
        } else {
          const newResetIndex = Math.max(defIndex > showData.length ? showData.length : defIndex);

          newHeightCache = currentHeightCache.slice(0, newResetIndex);
          newHeightCache.push(...Array(showData.length - newResetIndex).fill(cellHeight));
        }

        rowHeightCache.current = newHeightCache;
        tableContentHeight.current = newHeightCache.reduce((acc, total) => acc + total, 0);

        if (firstLoad.current) {
          firstLoad.current = false;
        } else {
          tableRef?.current?.resetAfterIndex(defIndex);
        }

        updateScr();
        setTableResetIndex(null);
      }

      setRefreshCount((old) => old + 1);
    }
  }, [JSON.stringify(showData)]);

  /*
  const updateRefreshCount = useCallback(
    debounce(() => {
      if (isMounted.current) {
        setRefreshCount((old) => old + 1);
      }
    }, 200),
    [],
  );
	*/
  useInconelEffect(() => {
    if (filterWindowId !== null && mainComponentElement !== null) {
      const filterHeader = mainComponentElement.querySelector(`.inconeltable-header-item-id-${filterWindowId}`);

      if (filterHeader !== null) {
        const { left: mainLeft } = getElementRect(mainComponentElement);
        const { left: headerLeft, width: headerWidth } = getElementRect(filterHeader);

        let positionX = headerLeft - mainLeft + headerWidth;

        positionX = positionX + 200 > tableWidth ? tableWidth - 200 : positionX;
        positionX = Math.max(positionX, 0);

        setFilterWindowPositionX(() => positionX);
      }
    }
  }, [filterWindowId, tableWidth]);

  useInconelEffect(() => {
    if (isMounted.current) {
      if (updateEffect) {
        clearTimeout(clearUpdateEffectRef.current);

        clearUpdateEffectRef.current = setTimeout(() => {
          if (isMounted.current) {
            resetUpdatedRowsObject();
          }
        }, 1500);
      }

      setTimeout(() => {
        if (isMounted.current && updatedRowsObject !== null && scrollRef.current !== null) {
          scrollRef.current.setTrackPosition(verticalScrollPosition.current);
        }
      }, 200);
    }
  }, [updatedRowsObject]);

  useInconelEffect(() => {
    resetHorizontalScrolls();
  }, [componentWidth, pinLeftArray, pinRightArray, hideArray, columnOrderArray, pageSize.rowCount, pagination.activePage, showData]);

  useInconelEffect(() => {
    columnWidthList.current = {};
    applyVerticalScrollValue(0);
  }, [pagination.activePage]);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <>
      <div className={`${rootCls}-table-container`} ref={tableContainerRef}>
        {filterWindowId !== null && filterWindowPositionX !== null && <FilterWindow positionX={filterWindowPositionX} />}
        <TableHeader
          visibleColumns={visibleColumns}
          tableContainerRef={tableContainerRef.current}
          elementPropsObject={elementPropsObject}
          groupBordersObject={groupBordersObject}
          leftIdList={leftIdList}
          centerIdList={centerIdList}
          rightIdList={rightIdList}
          headerHolderHeight={tableSectionSizes.headerHolderHeight}
          allColumnsHided={allColumnsHided}
          maxWidthAllowed={maxWidthAllowed}
        />
        <div ref={tableBodyRef} className={`${rootCls}-body-section`}>
          <List
            className={`${rootCls}-body-section-table`}
            ref={tableRef}
            width={componentWidth}
            // height={pageSize?.addMissingRows ? tableShowedHeight : showData.length * cellHeight}
            height={pageSize?.addMissingRows ? tableShowedHeight : Math.min(showData.length * cellHeight, tableShowedHeight)}
            itemCount={showData.length}
            itemSize={calculateRowHeight}
            itemData={{
              tableSectionSizes,
              elementPropsObject,
              leftColList,
              centerColList,
              rightColList,
              applyHorizontalScrollValues,
              groupBordersObject,
              rowStartIndex,
              allColumnsHided,
              maxWidthAllowed,
              rowHeightCache: rowHeightCache.current,
              columnWidthList: columnWidthList.current,
            }}
            style={{ overflow: 'hidden', boxSizing: 'border-box', width: '100%' }}
          >
            {RowWrapper}
          </List>
          {verticalScrollActive && !touchIsExist && (
            <div className={`${INCONELTABLE_MAIN_CLASSNAME}-vertical-scroll-holder`} style={{ height: `${tableShowedHeight}px` }}>
              <InconelTableScroll
                height={tableShowedHeight}
                targetContainerSize={tableShowedHeight}
                targetContentSize={tableContentHeight.current}
                onUpdate={(val) => {
                  tableRef?.current?.scrollTo(val);
                  verticalScrollPosition.current = val;

                  clearTimeout(verticalScrollUpdateRef.current);
                  verticalScrollUpdateRef.current = setTimeout(() => {
                    setVerticolScrollUpdateCount((old) => old + 1);
                  }, 10);
                }}
                isVertical
                ref={scrollRef}
                theme={theme}
              />
            </div>
          )}
          {getNoDataJsx()}
        </div>
        {footerIsEnabled && (
          <TableFooter
            visibleColumns={visibleColumns}
            leftIdList={leftIdList}
            centerIdList={centerIdList}
            rightIdList={rightIdList}
            groupBordersObject={groupBordersObject}
            columnWidthList={columnWidthList.current}
            elementPropsObject={elementPropsObject}
            maxWidthAllowed={maxWidthAllowed}
            tableSectionSizes={tableSectionSizes}
            applyHorizontalScrollValues={applyHorizontalScrollValues}
          />
        )}
        {!touchIsExist && horizontalScrollVisible && getHorizontalScrollBars()}
      </div>
      {pagination.enabled && <InconelTablePagination />}
    </>
  );
};

InconelTableBody.propTypes = {
  rowStartIndex: PropTypes.number,
  tableResetIndex: PropTypes.number,
  setTableResetIndex: PropTypes.func,
  tableResetVerticalScroll: PropTypes.bool,
  setTableResetVerticalScroll: PropTypes.func,
};

export default InconelTableBody;
