/* eslint-disable no-console */

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

import { debounce } from 'lodash';

import {
  dataValidator,
  enUpperCase,
  generalColumnValidator,
  getElementRect,
  isObject,
  sortArray,
  trUpperCase,
  getAllowedCols,
  setColumnInitialValues,
  initialOptionsValidator,
  selectedRowsValidator,
  isValidVariable,
  clearSystemConstantsFromRow,
  createFilterLookupFromArray,
  pinAndSortItemsValidator,
  hideItemsValidator,
  accordionDataValidator,
  isNumber,
  itemIsGroup,
  getAllParentsClassList
} from './subComponents/utils';
import { languageObject } from './subComponents/lang';

import CustomContextMenu from './subComponents/inconelTableBody/customContextMenu';
import InconelTableToolbar from './subComponents/inconelTableToolbar';
import InconelTableBody from './subComponents/inconelTableBody';
import { useInconelMemo } from './subComponents/hooks/useInconelMemo';
import { useInconelEffect } from './subComponents/hooks/useInconelEffect';
import { useInconelTableStorage } from './subComponents/hooks/useInconelTableStorage';

import { InconelTablePropsContext } from './subComponents/contexts/InconelTablePropsContext';

import {
  INCONELTABLE_THEME_LIGHT,
  INCONELTABLE_THEME_DARK,
  INCONELTABLE_LANG_TR,
  INCONELTABLE_LANG_EN,
  INCONELTABLE_SORT_ASC,
  INCONELTABLE_SORT_DESC,
  INCONELTABLE_SORT_ASC_UPPER,
  INCONELTABLE_SORT_DESC_UPPER,
  INCONELTABLE_MAIN_CLASSNAME,
  INCONELTABLE_AUTO,
  INCONELTABLE_PIN_ACCESS_LEFT,
  INCONELTABLE_PIN_ACCESS_RIGHT,
  INCONELTABLE_PIN_ACCESS_BOTH,
  INCONELTABLE_PIN_ACCESS_NONE,
  INCONELTABLE_HORIZONTAL_ALIGNMENT_LEFT,
  INCONELTABLE_HORIZONTAL_ALIGNMENT_CENTER,
  INCONELTABLE_HORIZONTAL_ALIGNMENT_RIGHT,
  INCONELTABLE_VERTICAL_ALIGNMENT_TOP,
  INCONELTABLE_VERTICAL_ALIGNMENT_CENTER,
  INCONELTABLE_VERTICAL_ALIGNMENT_BOTTOM,
  SELECTION_ADD,
  SELECTION_NONE,
  SELECTION_REMOVE,
  SELECTION_ALL,
  INCONELTABLE_ROW_INDEX,
  INCONELTABLE_ROW_TEXTS,
  INCONELTABLE_ROW_ACCORDION_CUSTOM,
  INCONELTABLE_ROW_ROWSPAN,
  INCONELTABLE_ROW_LOADMORE,
  INCONELTABLE_ROW_VALUES,
  INCONELTABLE_FILTER_EMPTY_VALUE
} from './subComponents/constants';

import {
  defaultAccordionProps,
  defaultCellPaddingProps,
  defaultHeaderPaddingProps,
  defaultEventManagementProps,
  defaultFilteringProps,
  defaultInitialOptions,
  defaultPageSizeProps,
  defaultPaginationProps,
  defaultScrollableProps,
  defaultSelectionProps,
  defaultSortingProps,
  defaultToolbarProps,
  defaultSettingSaveProps,
  defaultRowSpanProps
} from './defaultProps';

import './index.scss';

const InconelTable = forwardRef(
  (
    {
      id = null,
      data = [],
      columns = null,
      className = null,
      mergedColumns = [],
      initialOptions = { ...defaultInitialOptions },
      toolbar = { ...defaultToolbarProps },
      pageSize = { ...defaultPageSizeProps },
      dragEnabled = false,
      pinEnabled = false,
      autoResizeColumns = true,
      settingSave = { ...defaultSettingSaveProps },
      updateEffect = false,
      hoverEffect = true,
      showGroupBorders = false,
      headerHeight = 30,
      cellHeight = 30,
      customFooterHeight = null,
      maxTableHeight = null,
      cellPadding = { ...defaultCellPaddingProps },
      headerPadding = { ...defaultHeaderPaddingProps },
      equalRowHeight = false,
      eventManagement = { ...defaultEventManagementProps },
      fullData = true,
      pagination = { ...defaultPaginationProps },
      scrollable = { ...defaultScrollableProps },
      selection = { ...defaultSelectionProps },
      sorting = { ...defaultSortingProps },
      filtering = { ...defaultFilteringProps },
      accordion = { ...defaultAccordionProps },
      rowSpan = { ...defaultRowSpanProps },
      conditionalStyling = null,
      customLanguageTexts = {
        [INCONELTABLE_LANG_TR]: {},
        [INCONELTABLE_LANG_EN]: {}
      },
      fontFamily = 'Roboto, sans-serif',
      fontSize = 12,
      lang = INCONELTABLE_LANG_TR,
      theme = INCONELTABLE_THEME_LIGHT,
      render = true,
      customContextAction = null,
      customContextEnabled = false
    },
    ref
  ) => {
    const { inconelMemo } = useInconelMemo();
    const { getItem, setItem } = useInconelTableStorage();

    const idProp = id;
    const columnsProp = columns;
    const dataProp = Array.isArray(data) ? data : [];
    const initialOptionsProp = { ...defaultInitialOptions, ...initialOptions };
    const toolbarProp = { ...defaultToolbarProps, ...toolbar };
    const pageSizeProp = { ...defaultPageSizeProps, ...pageSize };
    const eventManagementProp = { ...defaultEventManagementProps, ...eventManagement };
    const cellPaddingProp = { ...defaultCellPaddingProps, ...cellPadding };
    const headerPaddingProps = { ...defaultHeaderPaddingProps, ...headerPadding };
    const paginationProp = { ...defaultPaginationProps, ...pagination };
    const scrollableProp = { ...defaultScrollableProps, ...scrollable };
    const selectionProp = { ...defaultSelectionProps, ...selection };
    const sortingProp = { ...defaultSortingProps, ...sorting };
    const filteringProp = { ...defaultFilteringProps, ...filtering };
    const accordionProp = { ...defaultAccordionProps, ...accordion };
    const rowSpanProp = { ...defaultRowSpanProps, ...rowSpan };
    const settingSaveProp = { ...defaultSettingSaveProps, ...settingSave };

    const isManualPageUpdate = paginationProp.activePage !== null;
    // const isManualSortingUpdate = isValidVariable(sortingProp.columnId) || isValidVariable(sortingProp.sortType);

    const allPageSelect = selectionProp.allPageSelect === null ? fullData : selectionProp.allPageSelect;
    let systemColumnsWidth = accordionProp.enabled ? 30 : 0;
    systemColumnsWidth += selectionProp.enabled && selectionProp.showCheckboxColumn ? 30 : 0;

    const dragSelectionIsEnabled = selectionProp.enabled && dataProp?.length > 0;

    const selectionColumnIsVisible = selectionProp.enabled && selectionProp.showCheckboxColumn;
    const accordionColumnIsVisible = accordionProp.enabled;
    const pagingIsActive = paginationProp.enabled && !scrollableProp.enabled;

    const pagingManualUpdate = useRef(isValidVariable(paginationProp?.activePage));
    const [activePage, setActivePage] = useState({
      no: isValidVariable(paginationProp?.activePage) ? paginationProp.activePage : 1,
      isClear: false
    });

    const [horizontalScrollVisible, setHorizontalScrollVisible] = useState(false);
    const [dragSelectionMode, setDragSelectionMode] = useState(null); // null pasif, true checked, false unchecked
    const [customContextInfo, setCustomContextInfo] = useState({ target: false, x: null, y: null });

    const handleSelectionDragStart = (rowNumber = null, isSelected = null) => {
      setDragSelectionMode(isSelected);

      handleSelect({
        index: rowNumber,
        type: isSelected ? SELECTION_ADD : SELECTION_REMOVE,
        targetId: 'drag'
      });
      // console.log('dragStart', rowNumber, isSelected);
    };

    const handleSelectionDragEnter = debounce((rowNumber = null) => {
      // console.log('DragEnter', rowNumber, dragSelectionMode);
      handleSelect({
        index: rowNumber,
        type: dragSelectionMode ? SELECTION_ADD : SELECTION_REMOVE,
        targetId: 'drag'
      });
    }, 50);

    const handleSelectionDragEnd = () => {
      setDragSelectionMode(null);
    };

    const prevData = useRef([]);
    const validData = useRef([]);
    const [showData, setShowData] = useState(null);
    const showedDataLength = useRef(0);
    const totalDataLength = pagingIsActive && !fullData ? paginationProp.dataCount : validData.current.length;
    const tableResetIndex = useRef(null);
    const tableResetVerticalScroll = useRef(false);
    const currentFilteredData = useRef([]);

    const loadedAccordionData = useRef([]);
    const cachedAccordionId = useRef(null);
    const dataLoadedFirstTime = useRef(false);

    const setTableResetIndex = (newIndex) => {
      tableResetIndex.current = newIndex;
    };
    const setTableResetVerticalScroll = (newVal) => {
      tableResetVerticalScroll.current = newVal;
    };

    const columnsMemo = inconelMemo(
      () => setColumnInitialValues(columnsProp, selectionColumnIsVisible, accordionColumnIsVisible),
      [columnsProp, selectionColumnIsVisible, accordionColumnIsVisible],
      0
    );

    const initialOptionsMemo = inconelMemo(
      () => initialOptionsValidator(initialOptionsProp, columnsMemo, selectionColumnIsVisible, accordionColumnIsVisible),
      [initialOptionsProp, selectionColumnIsVisible, accordionColumnIsVisible],
      1
    );

    const rootCls = INCONELTABLE_MAIN_CLASSNAME;
    let mainClassName = className === null ? rootCls : `${rootCls} ${className}`;
    mainClassName += ` ${rootCls}-${theme}`;

    const [componentSizes, setComponentSizes] = useState({ width: null, height: null });

    const isMounted = useRef(false);
    const mainContainerRef = useRef(null);

    const calculatedColumnProp = generalColumnValidator(columnsMemo, mergedColumns, initialOptionsMemo.columnOrder);

    const [columnOrderArray, setColumnOrderArray] = useState(
      pinAndSortItemsValidator(initialOptionsMemo.columnOrder, calculatedColumnProp.columns)
    );
    const [pinLeftArray, setPinLeftArray] = useState(pinAndSortItemsValidator(initialOptionsMemo.pinLeft, calculatedColumnProp.columns));
    const [pinRightArray, setPinRightArray] = useState(pinAndSortItemsValidator(initialOptionsMemo.pinRight, calculatedColumnProp.columns));
    const [hideArray, setHideArray] = useState(hideItemsValidator(initialOptionsMemo.hide));

    const [dragEnabledProp, setDragEnabledProp] = useState(dragEnabled);
    const [pinEnabledProp, setPinEnabledProp] = useState(pinEnabled);
    const [activeSort, setActiveSort] = useState({
      col: sortingProp.columnId,
      type: sortingProp.sortType,
      isClear: false
    });
    const [filterPool, setFilterPool] = useState({});
    const [updatedRowsObject, setUpdatedRowsObject] = useState(null);

    const [tableId, setTableId] = useState(idProp);

    // scrollable props ============================================================
    const [moreDataWaiting, setMoreDataWaiting] = useState(false);
    const scrollableParams = {
      enabled: scrollableProp.enabled,
      loadMoreShow: !fullData && scrollableProp.enabled && scrollableProp.loadMoreShow,
      loadMoreAction: () => {
        setMoreDataWaiting(() => true);

        if (typeof scrollableProp.loadMoreAction === 'function') {
          scrollableProp.loadMoreAction(tableId);
        }
      },
      moreDataWaiting
    };

    // rowSpan props ============================================================
    const rowSpanParams = { enabled: rowSpanProp.enabled, customFnc: rowSpanProp.customFnc };

    rowSpanParams.colList = inconelMemo(
      () => (rowSpanProp.enabled ? getAllowedCols(rowSpanProp.activeCols, rowSpanProp.passiveCols, columnsMemo) : []),
      [columnsMemo, rowSpanProp],
      2
    );

    // pageSize props ============================================================
    const { dynamicRowCount } = pageSizeProp;
    const [rowCount, setRowCount] = useState(pageSizeProp.rowCount);

    const updateRowCount = (newCount, updatedByUser = false) => {
      if (newCount !== rowCount) {
        settingChangedByUser.current = updatedByUser;

        setTableHeight(() => cellHeight * newCount);
        setRowCount(() => newCount);
      }
    };

    const pageSizeProps = {
      rowCount,
      updateRowCount,
      showCombobox: dataProp.length === 0 ? false : pageSizeProp.showCombobox,
      options: pageSizeProp.options,
      comboPosition: pageSizeProp.comboPosition,
      addMissingRows: pageSizeProp.addMissingRows,
      displayedRowCount: pageSizeProp.displayedRowCount
    };

    const maxTableHeightProp = maxTableHeight === null ? rowCount * cellHeight : maxTableHeight;
    const [tableHeight, setTableHeight] = useState(cellHeight * rowCount);

    // selection props ============================================================
    const [selectedRows, setSelectedRows] = useState(
      selectionProp.selectedRows === null ? [] : selectedRowsValidator(selectionProp.selectedRows)
    );

    const resetUpdatedRowsObject = () => {
      if (isMounted.current) {
        setUpdatedRowsObject(() => null);
      }
    };

    const checkAllSelected = () => {
      const totalDataCount = pagingIsActive && !fullData ? paginationProp.dataCount : currentFilteredData.current.length;

      let selectableTotalDataLen = allPageSelect || !pagingIsActive ? totalDataCount : Math.min(rowCount, totalDataLength);

      const disableAction = selectionProp.selectActiveAction;

      if (typeof disableAction === 'function') {
        let startIndex = allPageSelect || !pagingIsActive ? 0 : (activePage.no - 1) * rowCount;
        let endIndex = allPageSelect || !pagingIsActive ? totalDataCount : startIndex + rowCount;

        startIndex = !fullData ? 0 : startIndex;
        endIndex = !fullData ? currentFilteredData.current.length : endIndex;

        const targetData = [...currentFilteredData.current].slice(startIndex, endIndex);

        targetData.forEach((rowData) => {
          if (isValidVariable(rowData)) {
            const rowNumber = rowData?.[INCONELTABLE_ROW_INDEX];

            const disableResult = disableAction({ rowData, rowNumber });
            if (!isValidVariable(disableResult) || !disableResult) {
              selectableTotalDataLen--;
            }
          }
        });
      }

      return {
        isSelected: selectedRows.length === selectableTotalDataLen,
        isVisible: selectionProp.showSelectAll && selectableTotalDataLen > 0
      };
    };

    const handleSelect = ({ index = null, type = SELECTION_ADD, event = null, targetId = 'checkbox' } = {}) => {
      // type 	-> add, remove, all, none
      let newList = type === SELECTION_NONE || !selectionParams.multipleRowSelect ? [] : [...selectedRows];

      if (type === SELECTION_ADD) {
        newList.push(index);
      } else if (type === SELECTION_REMOVE) {
        newList = newList.filter((listId) => listId !== index);
      } else if (type === SELECTION_ALL) {
        newList = [];

        const totalDataCount = pagingIsActive && !fullData ? paginationProp.dataCount : currentFilteredData.current.length;

        const startIndex = allPageSelect || !pagingIsActive ? 0 : (activePage.no - 1) * rowCount;
        const endIndex = allPageSelect || !pagingIsActive ? totalDataCount : startIndex + rowCount;
        const disableAction = selectionProp.selectActiveAction;

        const targetData = [...currentFilteredData.current].slice(startIndex, endIndex);

        targetData.forEach((rowData) => {
          if (isValidVariable(rowData)) {
            const rowNumber = rowData?.[INCONELTABLE_ROW_INDEX];

            if (typeof disableAction === 'function') {
              const disableResult = disableAction({ rowData, rowNumber });

              if (!isValidVariable(disableResult) || disableResult) {
                newList.push(rowNumber);
              }
            } else {
              newList.push(rowNumber);
            }
          }
        });
      }

      applySelectionArray({ selectedList: [...new Set(newList)], rowIndex: index, event, targetId, type });
    };

    const applySelectionArray = ({ selectedList = null, targetId = null, rowIndex = null, event = null, type = null } = {}) => {
      if (!selectionParams.updateByUser) {
        setSelectedRows(() => selectedList);
      }

      selectionParams?.onChange?.({
        data: exportSelectedData(selectedList),
        indexes: selectedList,
        event,
        targetId,
        rowIndex,
        actionType: type
      });
    };

    const exportSelectedData = (indexList) =>
      indexList.map((index) => {
        let newItem = null;
        if (pagingIsActive && !fullData) {
          const finded = showData.find((dataItem) => dataItem?.[INCONELTABLE_ROW_INDEX] === index);
          newItem = isValidVariable(finded) ? { ...finded, rowIndex: index } : newItem;
        } else {
          newItem = { ...validData.current[index] };
          newItem.rowIndex = index;
        }
        return clearSystemConstantsFromRow(newItem);
      });

    const selectAllParams = checkAllSelected();
    const selectionParams = {
      enabled: selectionProp.enabled,
      showCheckboxColumn: selectionProp.showCheckboxColumn,
      showSelectAll: selectAllParams.isVisible,
      multipleRowSelect: selectionProp.multipleRowSelect,
      preventDeselect: selectionProp.preventDeselect,
      selectActiveAction: selectionProp.selectActiveAction,
      allPageSelect,
      onChange: selectionProp.onChange,
      updateByUser: selectionProp.selectedRows !== null,
      setSelectedRows: handleSelect,
      allItemsSelected: selectAllParams.isSelected,
      selectedRows,
      dragSelectionIsEnabled,
      dragSelectionMode,
      handleSelectionDragStart,
      handleSelectionDragEnter,
      handleSelectionDragEnd
    };

    selectionParams.colList = inconelMemo(
      () => (selectionProp.enabled ? getAllowedCols(selectionProp.activeCols, selectionProp.passiveCols, columnsMemo) : []),
      [columnsMemo, selectionProp],
      3
    );
    // selection props ============================================================

    // accordion props ============================================================
    const [accordionState, setAccordionState] = useState({ no: null, isClear: false });
    const currentAccordionRowIndex = useRef(null);

    const loadAccordionData = useCallback((accData) => {
      loadedAccordionData.current = [...accData];

      setAccordionState(() => ({ no: cachedAccordionId.current, isClear: false }));
    }, []);

    const handleAccordionClick = (rowNumber, rowData) => {
      const isOpened = rowNumber !== null;

      if (isOpened && typeof accordionProp.onOpen === 'function') {
        accordionProp.onOpen({ rowData, rowNumber });
      }

      if (!isOpened && typeof accordionProp.onClose === 'function') {
        accordionProp.onClose({ rowData, rowNumber });
      }

      if (isOpened && typeof accordionProp.dataProviderFunction === 'function' && accordionProp.customJsxFunction === null) {
        cachedAccordionId.current = rowNumber;
        accordionProp.dataProviderFunction({
          rowData: clearSystemConstantsFromRow(rowData),
          accordionCallback: loadAccordionData,
          isOpened
        });
      } else {
        setAccordionState(() => ({ no: rowNumber, isClear: false }));
      }
    };

    const accordionParams = {
      enabled: accordionProp.enabled,
      subDataKey: accordionProp.subDataKey,
      customHeight: accordionProp.customHeight,
      customAccordion: accordionProp.customJsxFunction,
      accordionFullData: typeof accordionProp.customJsxFunction !== 'function' && typeof accordionProp.dataProviderFunction !== 'function',
      accordionState,
      handleAccordionClick
    };

    accordionParams.colList = inconelMemo(
      () => (accordionProp.enabled ? getAllowedCols(accordionProp.activeCols, accordionProp.passiveCols, columnsMemo) : []),
      [columnsMemo, accordionProp],
      4
    );

    // accordion props ============================================================

    // sorting props ============================================================
    const sortUpdate = ({ newSortId = null, newSortType = null } = {}) => {
      // if (!isManualSortingUpdate) {
      setActiveSort(() => ({ col: newSortId, type: newSortType, isClear: false }));

      if (typeof sortingProp.sortingAction === 'function') {
        sortingProp.sortingAction(newSortId, newSortType);
      }
    };

    const sortingParams = {
      enabled: sortingProp.enabled,
      sortingAction: sortingProp.sortingAction,
      isClearable: sortingProp.isClearable,
      activeSort,
      sortUpdate
    };

    const serverSideSortActive = typeof sortingProp.sortingAction === 'function';

    sortingParams.colList = inconelMemo(
      () => (sortingProp.enabled ? getAllowedCols(sortingProp.activeCols, sortingProp.passiveCols, columnsMemo) : []),
      [columnsMemo, sortingProp],
      5
    );
    // sorting props ============================================================

    const handlePageChnage = (pageNo) => {
      if (typeof paginationProp.onPageChange === 'function') {
        paginationProp.onPageChange(pageNo);
      }

      if (!isManualPageUpdate) {
        setActivePage(() => ({ no: pageNo, isClear: false }));
      }
    };

    const paginationParams = {
      enabled: pagingIsActive,
      activePage: activePage.no,
      dataCount: paginationProp.dataCount,
      disabled: paginationProp.disabled,
      setPage: handlePageChnage
    };

    eventManagementProp.colList = inconelMemo(
      () => getAllowedCols(eventManagementProp.activeCols, eventManagementProp.passiveCols, columnsMemo),
      [columnsMemo, eventManagementProp],
      6
    );

    const rowStartIndex = pagingIsActive && !fullData ? (activePage.no - 1) * rowCount : 0;

    // filtering props ============================================================
    const filteringColList = inconelMemo(
      () => (filteringProp.enabled ? getAllowedCols(filteringProp.activeCols, filteringProp.passiveCols, columnsMemo) : []),
      [columnsMemo, filteringProp],
      7
    );

    const filteringOutsideClear = useRef(false);
    const filterOrderIdList = useRef([]);
    const restrictedFilterPool = useRef({}); // { '1':['ABC-1', 'ABC-2'] }
    const [filteringList, setFilteringList] = useState({}); // { '1':['ABC-1', 'ABC-2'] }
    const [filterWindowId, setFilterWindowId] = useState(null);

    const updateFilter = ({ id: updateId = null, list = [] } = {}) => {
      let newOrder = [...filterOrderIdList.current];

      if (list.length === 0) {
        newOrder = newOrder.filter((orderId) => orderId !== updateId);
      } else {
        newOrder.push(updateId);
      }

      filterOrderIdList.current = newOrder;

      setFilteringList((oldList) => {
        const newList = { ...oldList };
        if (list.length === 0) {
          delete newList[updateId];
        } else {
          newList[updateId] = list;
        }

        return newList;
      });

      applySelectionArray({ selectedList: [], type: 'system' });
    };

    const getCurrentFilterLookups = () => {
      if (!filteringProp.enabled || filteringColList.length === 0) {
        return null;
      }

      const currentLookups = {};
      const selectCounts = {};

      filteringColList.forEach((filterId) => {
        const isFirstFilter = filterOrderIdList.current?.[0] === filterId || Object.keys(filteringList).length === 0;
        const thisFilterList = Array.isArray(filteringList?.[filterId]) ? filteringList[filterId] : [];
        const thisFilterPool = Array.isArray(filterPool?.[filterId]) ? filterPool[filterId] : [];
        const thisRestrictedFilterPool = Array.isArray(restrictedFilterPool.current?.[filterId])
          ? restrictedFilterPool.current[filterId]
          : [];

        const customData = filteringProp?.dataProviderObject?.[filterId];
        let lookup = Array.isArray(customData) ? customData : null;

        if (lookup === null) {
          lookup = createFilterLookupFromArray(isFirstFilter ? thisFilterPool : thisRestrictedFilterPool);
        } else if (!isFirstFilter) {
          lookup = lookup.filter((listItem) => thisRestrictedFilterPool.includes(String(listItem.value)));
        }

        currentLookups[filterId] = lookup;

        if (isValidVariable(filteringProp?.customBubbleCountsObject?.[filterId])) {
          selectCounts[filterId] = filteringProp.customBubbleCountsObject[filterId];
        } else {
          selectCounts[filterId] =
            thisFilterList.length === 0 ? null : lookup.filter((item) => !thisFilterList.includes(item?.value)).length;
        }
      });

      return { data: currentLookups, count: selectCounts };
    };

    const filteringParams = {
      enabled: filteringProp.enabled,
      onChange: filteringProp.onChange,
      customFilterFunction: filteringProp.customFilterFunction,
      showBubbles: filteringProp.showBubbles,
      lookupsAndCounts: getCurrentFilterLookups(),
      filterButtonShow: filteringProp.filterButtonShow,
      windowHeight: filteringProp.windowHeight,
      showFilterIconsOnStart: filteringProp.showFilterIconsOnStart,
      colList: filteringColList,
      updateFilter,
      filteringList,
      filterWindowId,
      setFilterWindowId
    };

    // filtering props ============================================================

    const memoizedLanguageObject = inconelMemo(
      () => {
        const defaultLangIdsList = Object.keys(languageObject);
        const selectedLangKey = defaultLangIdsList.includes(lang) ? lang : INCONELTABLE_LANG_TR;

        let resultLangPool = { ...languageObject[selectedLangKey] };

        if (isObject(customLanguageTexts?.[selectedLangKey])) {
          resultLangPool = { ...resultLangPool, ...customLanguageTexts[selectedLangKey] };
        }

        return resultLangPool;
      },
      [customLanguageTexts, languageObject, lang],
      8
    );
    //

    // settingSave props ============================================================
    const settingChangedByUser = useRef(false);
    const storageId = isValidVariable(settingSaveProp.storageId) ? settingSaveProp.storageId : idProp;
    const [settingSaveIsActive, setSettingSaveIsActive] = useState(settingSaveProp.enabled && settingSaveProp.isActive);

    const settingSaveParams = {
      enabled: settingSaveProp.enabled,
      settingSaveIsActive,
      switchAction: (isChecked) => {
        if (!isChecked) {
          setItem(storageId, null);
        }

        setSettingSaveIsActive(() => isChecked);
      }
    };

    //

    const headerPaddingMemo = inconelMemo(
      () => {
        const extraPx = sortingParams.enabled || filteringProp.enabled ? 20 : 0;

        return { horizontal: headerPaddingProps.horizontal, vertical: headerPaddingProps.vertical, extraPx };
      },
      [headerPaddingProps],
      9
    );

    const getLanguageText = useCallback(
      (strKey) => (typeof memoizedLanguageObject?.[strKey] === 'string' ? memoizedLanguageObject[strKey] : ''),
      [memoizedLanguageObject]
    );

    const convertUpperCase = useCallback(
      (val) => {
        if (lang === INCONELTABLE_LANG_TR) {
          return trUpperCase(val);
        }

        if (lang === INCONELTABLE_LANG_EN) {
          return enUpperCase(val);
        }

        return val;
      },
      [lang]
    );

    const handleContextClick = (e) => {
      e.preventDefault();

      const { target } = e ?? {};
      const classList = getAllParentsClassList({ startElement: target, endElement: mainContainerRef.current });

      const targetInHeader = classList?.find((classItem) => String(classItem).includes('inconeltable-header'));

      if (pinEnabledProp && targetInHeader) {
        return false;
      }

      const tableRect = getElementRect(mainContainerRef.current);
      const posX = e.clientX - tableRect.left;
      const posY = e.clientY - tableRect.top;

      setCustomContextInfo({ target, x: posX + 10, y: posY + 10 });

      return true;
    };

    useEffect(() => {
      if (dynamicRowCount && componentSizes.height !== null) {
        const toolbarHeight = toolbarProp.enabled ? 35 : 0;
        const headerAreaHeight = calculatedColumnProp.maxLevel * headerHeight;

        const footerElm = mainContainerRef.current.querySelector(`.${rootCls}-footer`);
        const footerHeight = footerElm === null ? 0 : getElementRect(footerElm).height;

        const horizontalScrollHeight = horizontalScrollVisible ? 12 : 0;

        const pagingHeight = pagingIsActive ? 30 : 0;

        const bodyNewHeight =
          componentSizes.height - (toolbarHeight + headerAreaHeight + footerHeight + horizontalScrollHeight + pagingHeight);

        let updateCount = Math.floor(bodyNewHeight / cellHeight);
        updateCount = updateCount < 3 ? 3 : updateCount;

        setTableHeight(() => bodyNewHeight - (bodyNewHeight % cellHeight));
        updateRowCount(updateCount);
      }
    }, [componentSizes.height, horizontalScrollVisible]);

    const debounceObserverResize = debounce(() => {
      if (isMounted.current && mainContainerRef.current !== null) {
        const rect = getElementRect(mainContainerRef.current);
        setComponentSizes(() => ({ width: rect.width, height: rect.height }));
      }
    }, 300);

    const setPinAndDragStates = (val, type) => {
      // type 	-> pin, drag
      if (type === 'pin') {
        setPinEnabledProp(() => val);
      } else if (type === 'drag') {
        setDragEnabledProp(() => val);
      }
    };

    const setInitialOptionStates = (val, type) => {
      // type 	-> order, pinLeft, pinRight, hide

      if (type === 'order') {
        setColumnOrderArray(() => val);
      } else if (type === 'pinLeft') {
        setPinLeftArray(() => val);
      } else if (type === 'pinRight') {
        setPinRightArray(() => val);
      } else if (type === 'hide') {
        setHideArray(() => val);
      }

      settingChangedByUser.current = true;
    };

    // =================================== SHOW ARRAY UPDATE =======================================
    const updateShowedArray = ({
      accordionClearBySystem = false,
      activePageClearBySystem = false,
      filterClearBySystem = false,
      sortClearBySystem = false
    } = {}) => {
      const { no: accordionNo, isClear: accordionIsClear } = accordionState;
      const { col: sortedCol, type: sortType, isClear: sortIsClear } = activeSort;
      const currentRowCount = rowCount;

      let result = validData.current.concat();
      const activePageIndex = activePageClearBySystem && !pagingManualUpdate.current ? 0 : activePage.no - 1;
      const filterIdList = Object.keys(filteringList);

      // FİLTERING ===============================================
      if (filteringParams.enabled && fullData && filterIdList.length > 0 && !filterClearBySystem) {
        let i = 0;
        const newResult = [];
        const len = filterIdList.length;
        const newRestrictedFilterPool = {};

        filteringParams.colList.forEach((colId) => {
          newRestrictedFilterPool[colId] = [];
        });

        result.forEach((dataItem) => {
          let isShow = true;

          if (isValidVariable(dataItem)) {
            for (i = 0; i < len; i++) {
              const filterId = filterIdList[i];
              const dataText = isValidVariable(dataItem?.[INCONELTABLE_ROW_TEXTS]?.[filterId])
                ? String(dataItem[INCONELTABLE_ROW_TEXTS][filterId])
                : null;

              if (dataText === null && filteringList[filterId].includes(INCONELTABLE_FILTER_EMPTY_VALUE)) {
                isShow = false;
                break;
              }

              if (filteringList[filterId].findIndex((filterItem) => String(filterItem) === dataText) !== -1) {
                isShow = false;
                break;
              }
            }
          }

          if (isShow) {
            filteringParams.colList.forEach((filterId) => {
              const cellStr = isValidVariable(dataItem?.[INCONELTABLE_ROW_TEXTS]?.[filterId])
                ? dataItem[INCONELTABLE_ROW_TEXTS][filterId]
                : INCONELTABLE_FILTER_EMPTY_VALUE;

              if (!newRestrictedFilterPool[filterId].includes(cellStr)) {
                newRestrictedFilterPool[filterId].push(cellStr);
              }
            });

            newResult.push(dataItem);
          }
        });

        result = newResult;
        restrictedFilterPool.current = newRestrictedFilterPool;
      } // end of filtering

      const concatedResult = result.concat();
      currentFilteredData.current = concatedResult;
      showedDataLength.current = concatedResult.length;

      // SORTING ===============================================
      if (!serverSideSortActive && !sortIsClear && !sortClearBySystem) {
        if (sortedCol !== null && sortType !== null) {
          // result = sortArray(result, columns?.[sortedCol].dataKey, sortType);
          result = sortArray(result, `${INCONELTABLE_ROW_VALUES}.${sortedCol}`, sortType);
        }
      } // end of sorting

      // data full ise pagination varsa
      // PAGINATION SLICE ===============================================
      if (pagingIsActive && fullData) {
        const startIndex = activePageIndex * currentRowCount;

        result = result.slice(startIndex, startIndex + currentRowCount);
      } // end of pagination slice

      // ACCORDION ===============================================
      if (accordionNo !== null && !accordionIsClear && !accordionClearBySystem) {
        const dataIndex = result.findIndex((row) => row[INCONELTABLE_ROW_INDEX] === accordionNo);
        let subData = [];

        if (accordionProp.customJsxFunction !== null) {
          subData = [{ [INCONELTABLE_ROW_ACCORDION_CUSTOM]: true }];
        } else if (accordionProp.dataProviderFunction !== null) {
          subData = loadedAccordionData.current;
        } else if (dataIndex !== -1) {
          subData = result[dataIndex]?.[accordionParams?.subDataKey];
        }

        if (Array.isArray(subData)) {
          const accordionList = accordionDataValidator({ data: subData, columns: columnsMemo, accordionNo });
          /*
        const accordionList = subData.map((dataItem, index) => ({
          ...dataItem,
          [INCONELTABLE_ROW_INDEX]: accordionNo,
          [INCONELTABLE_ROW_ACCORDION_INDEX]: index,
        }));
        */
          result.splice(dataIndex + 1, 0, ...accordionList);
        }
      } // end of accordion

      // ROWSPAN CHECK ===============================================
      if (rowSpanParams.enabled && rowSpanParams.colList.length > 0 && result.length > 1) {
        const defaultRowSpanObj = {};
        const spanIdList = rowSpanParams.colList;

        spanIdList.forEach((spanId) => {
          const idList = Array.isArray(spanId) ? [...spanId] : [spanId];

          idList.forEach((idItem) => {
            defaultRowSpanObj[idItem] = null;
          });
        });

        let currentRowSpanObj = { ...defaultRowSpanObj };

        result.forEach((row, index) => {
          const nextDataItem = result[index + 1];
          let rowSpanIsEnded = index === result.length - 1 || result[index + 1] === null;

          if (!rowSpanIsEnded && accordionParams.enabled && Array.isArray(nextDataItem?.[accordionParams.subDataKey])) {
            rowSpanIsEnded = true;
          }

          spanIdList.forEach((spanId) => {
            let columnSpanIsEnded = rowSpanIsEnded;

            const spanDetectObj = rowSpanDetect({
              spanId,
              columnSpanIsEnded,
              row,
              nextDataItem,
              currentRowSpanObj,
              rowIndex: index
            });
            columnSpanIsEnded = spanDetectObj?.columnSpanIsEnded;
            currentRowSpanObj = spanDetectObj?.currentRowSpanObj;
          }); // end of id List loop

          result[index][INCONELTABLE_ROW_ROWSPAN] = { ...currentRowSpanObj };
          // console.log(index, currentRowSpanObj);
        });
      } // end of rowspan check

      if (scrollableParams.loadMoreShow) {
        result.push({ [INCONELTABLE_ROW_LOADMORE]: true });
      }

      // MISSING ROW ADDING ===============================================
      const missingDataCount = currentRowCount - result.length;

      if (pageSizeProps.addMissingRows && missingDataCount > 0) {
        for (let i = 0; i < missingDataCount; i++) {
          result.push(null);
        }
      } // end of missing row adding

      // console.log('res', result);

      setShowData(() => result);
    };

    const rowSpanDetect = ({
      spanId = null,
      columnSpanIsEnded = null,
      row = null,
      nextDataItem = null,
      currentRowSpanObj = null,
      rowIndex = null
    } = {}) => {
      const spanObj = { ...currentRowSpanObj };
      const colIdList = Array.isArray(spanId) ? [...spanId] : [spanId];
      let mergeFinished = columnSpanIsEnded;

      colIdList.forEach((colId) => {
        if (!mergeFinished) {
          const val1 = row?.[INCONELTABLE_ROW_TEXTS]?.[colId];
          const val2 = nextDataItem?.[INCONELTABLE_ROW_TEXTS]?.[colId];

          const customResult = rowSpanParams?.customFnc?.({ rowIndex, colId, rowData: row }) ?? null;
          // console.log(rowSpanParams.customFnc);

          mergeFinished = (!isValidVariable(val1) && !isValidVariable(val2)) || val1 !== val2;
          mergeFinished = isValidVariable(customResult) && !customResult ? true : mergeFinished;
        }
      });

      colIdList.forEach((colId) => {
        const currentSpanVal = spanObj[colId];
        let newSpanVal = null;

        if (!mergeFinished) {
          newSpanVal = currentSpanVal === null || isNaN(currentSpanVal) ? 1 : currentSpanVal + 1;
        } else if (currentSpanVal !== null) {
          newSpanVal = isNaN(currentSpanVal) ? null : `${currentSpanVal + 1}-end`;
        }

        spanObj[colId] = newSpanVal;
      });

      // currentRowSpanObj 	-> { '0':'null }, { '0':1 }, { '0':2 }, { '0':'3-end' }

      return { columnSpanIsEnded: mergeFinished, currentRowSpanObj: spanObj };
    };

    const systemResetActivePage = () => {
      if (!isManualPageUpdate && paginationParams.enabled) {
        setActivePage(() => ({ no: 1, isClear: true }));
      }
    };

    const systemResetVerticalScroll = () => {
      tableResetIndex.current = 0;
      tableResetVerticalScroll.current = true;
    };

    const systemResetAccordion = () => {
      if (accordionParams.enabled) {
        currentAccordionRowIndex.current = null;
        loadedAccordionData.current = [];
        cachedAccordionId.current = null;
        setAccordionState(() => ({ no: null, isClear: true }));
      }
    };

    /*
  const systemResetSort = () => {
    if (sortingParams.enabled && !serverSideSortActive) {
      setActiveSort(() => ({ col: null, type: null, isClear: true }));
    }
  };
  */

    const systemResetFilter = () => {
      if (filteringProp.enabled) {
        setFilteringList(() => ({}));
      }
    };

    // DATA UPDATE ==================================================================
    // ==============================================================================
    useInconelEffect(() => {
      const validateObject = dataValidator({
        prevData: prevData.current,
        newData: dataProp,
        columns: columnsMemo,
        rowStartIndex
      });

      if (!dataLoadedFirstTime.current && validateObject.resultArray.length > 0) {
        dataLoadedFirstTime.current = true;
      }

      const prevDataLen = Array.isArray(prevData.current) ? prevData.current.length : 0;

      prevData.current = validateObject.resultArray;

      if (validateObject.updatedRowsObject !== null && Object.keys(validateObject.updatedRowsObject).length > 0) {
        // some cells update
        tableResetIndex.current = Math.min(...Object.keys(validateObject.updatedRowsObject));
      } else if (moreDataWaiting) {
        // data waiting from loadmore
        tableResetIndex.current = Math.abs(prevDataLen - 1);
        setMoreDataWaiting(() => false);
      } else {
        systemResetVerticalScroll();
      }

      setFilterPool(() => validateObject.filterPool);
      validData.current = validateObject.resultArray;

      if (dataLoadedFirstTime.current && selectionProp.enabled && !allPageSelect) {
        applySelectionArray({ selectedList: [], type: 'system' });
      }

      systemResetAccordion();
      systemResetActivePage();
      // systemResetSort();
      systemResetFilter();
      setUpdatedRowsObject(() => validateObject.updatedRowsObject);
      updateShowedArray({
        accordionClearBySystem: true,
        activePageClearBySystem: true,
        filterClearBySystem: true
        // sortClearBySystem: true,
      });
    }, [dataProp, rowStartIndex]);

    useInconelEffect(
      () => {
        systemResetVerticalScroll();
        systemResetActivePage();
        systemResetAccordion();

        setTimeout(() => {
          if (isMounted.current) {
            updateShowedArray({ accordionClearBySystem: true, activePageClearBySystem: true });

            if (typeof pageSizeProp?.pageSizeChange === 'function') {
              pageSizeProp.pageSizeChange(rowCount);
            }
          }
        }, 200);
      },
      [rowCount],
      false
    );

    // FILTERING UPDATE ===========================================================
    // ==============================================================================
    useInconelEffect(() => {
      if (filteringParams.enabled && !filteringOutsideClear.current) {
        systemResetVerticalScroll();
        systemResetActivePage();
        systemResetAccordion();

        updateShowedArray({ accordionClearBySystem: true, activePageClearBySystem: true });
      }
    }, [filteringList]);

    // ACTIVE PAGE UPDATE ===========================================================
    // ==============================================================================
    useInconelEffect(() => {
      if (paginationParams.enabled && !activePage.isClear) {
        systemResetVerticalScroll();
        systemResetAccordion();

        if (dataLoadedFirstTime.current && selectionProp.enabled && !allPageSelect) {
          applySelectionArray({ selectedList: [], type: 'system' });
        }

        updateShowedArray({ accordionClearBySystem: true });
      }
    }, [activePage.no]);
    // ==============================================================================

    // SORTING UPDATE ===============================================================
    // ==============================================================================
    useInconelEffect(() => {
      if (!activeSort.isClear) {
        systemResetVerticalScroll();
        systemResetAccordion();
        systemResetActivePage();

        if (!serverSideSortActive) {
          updateShowedArray({ accordionClearBySystem: true, activePageClearBySystem: true });
        }
      }
    }, [activeSort, serverSideSortActive]);

    // ACCORDION UPDATE =============================================================
    // ==============================================================================
    useInconelEffect(() => {
      const { no, isClear } = accordionState;

      if (accordionParams.enabled && !isClear && Array.isArray(showData)) {
        const currentNum = currentAccordionRowIndex.current;

        let newIndex = null;
        if (no !== null) {
          newIndex = showData.findIndex((dataItem) => dataItem[INCONELTABLE_ROW_INDEX] === no);
          newIndex = Math.max(newIndex, 0);
        }

        if (currentNum !== newIndex) {
          currentAccordionRowIndex.current = newIndex;

          let resetIndex = null;
          if (currentNum !== null && newIndex !== null) {
            resetIndex = Math.min(currentNum, newIndex);
          } else if (currentNum === null) {
            resetIndex = newIndex;
          } else if (no === null) {
            resetIndex = currentNum;
          }

          if (resetIndex !== null) {
            tableResetIndex.current = resetIndex;
          }
        }

        updateShowedArray();
      }
    }, [accordionState]);

    // SELECTION UPDATE BY USER =====================================================
    // ==============================================================================
    useInconelEffect(
      () => {
        // if (selectionProp.enabled && Array.isArray(selectionProp.selectedRows)) {
        if (Array.isArray(selectionProp.selectedRows)) {
          setSelectedRows(() => selectionProp.selectedRows);
        }
      },
      [selectionProp.selectedRows],
      false
    );
    // DID MOUNT ====================================================================
    // ==============================================================================
    useEffect(() => {
      isMounted.current = true;
      const mainElement = mainContainerRef.current;
      let inconelTableObserver;

      // local storage
      if (settingSaveProp.enabled) {
        const colIdList = Object.keys(calculatedColumnProp.columns);
        const storageData = getItem(storageId);

        let newOrderList =
          Array.isArray(storageData?.order) &&
          columnOrderArray.length === storageData.order.length &&
          storageData.order.every((subId) => colIdList.includes(subId))
            ? storageData.order
            : null;

        let newPinLeftList =
          Array.isArray(storageData?.pinLeft) && storageData.pinLeft.every((subId) => colIdList.includes(subId))
            ? storageData.pinLeft
            : null;

        let newPinRightList =
          Array.isArray(storageData?.pinRight) && storageData.pinRight.every((subId) => colIdList.includes(subId))
            ? storageData.pinRight
            : null;

        let newHideList =
          Array.isArray(storageData?.hide) && storageData.hide.every((subId) => colIdList.includes(subId)) ? storageData.hide : null;

        newOrderList = pinAndSortItemsValidator(newOrderList, calculatedColumnProp.columns);
        newPinLeftList = pinAndSortItemsValidator(newPinLeftList, calculatedColumnProp.columns);
        newPinRightList = pinAndSortItemsValidator(newPinRightList, calculatedColumnProp.columns);
        newHideList = hideItemsValidator(newHideList);

        if (newOrderList !== null || newPinLeftList !== null || newPinRightList !== null || newHideList !== null) {
          setSettingSaveIsActive(() => true);
        }

        if (newOrderList !== null) {
          setColumnOrderArray(() => newOrderList);
        }

        if (newPinLeftList !== null) {
          setPinLeftArray(() => newPinLeftList);
        }

        if (newPinRightList !== null) {
          setPinRightArray(() => newPinRightList);
        }

        if (newHideList !== null) {
          setHideArray(() => newHideList);
        }

        if (isNumber(storageData?.rowCount)) {
          updateRowCount(storageData?.rowCount);
        }
      }
      // local storage

      if (mainElement !== null) {
        inconelTableObserver = new ResizeObserver(() => {
          window.requestAnimationFrame(() => {
            debounceObserverResize();
          });
        });
        inconelTableObserver.observe(mainElement);
      }

      return () => {
        isMounted.current = false;
        if (mainElement !== null) {
          inconelTableObserver.unobserve(mainElement);
        }
      };
    }, []);

    // settingSave
    useInconelEffect(
      () => {
        if (settingChangedByUser.current) {
          const filteredList = hideArray.filter((hideItem) => !itemIsGroup(hideItem));
          initialOptionsMemo?.hideOnChange?.(filteredList ?? []);
        }

        if (settingSaveIsActive && settingChangedByUser.current) {
          setItem(storageId, {
            order: columnOrderArray,
            pinLeft: pinLeftArray,
            pinRight: pinRightArray,
            hide: hideArray,
            rowCount
          });
        }
      },
      [columnOrderArray, pinLeftArray, pinRightArray, hideArray, rowCount],
      false
    );

    useInconelEffect(() => {
      if (pagingIsActive && isManualPageUpdate) {
        setActivePage(() => ({ no: paginationProp.activePage, isClear: false }));
      }
    }, [paginationProp.activePage]);

    useLayoutEffect(() => {
      let currentId = tableId;
      let idCounter = 1;

      while (document.querySelectorAll(`#${currentId}`).length > 1) {
        console.log('Same id in multiple tables', currentId);
        currentId = `${currentId}${idCounter}`;
        idCounter++;
      }

      setTableId(() => String(currentId));
    }, []);

    // IMPERATIVE ACTIONS ===========================================
    useImperativeHandle(ref, () => ({
      setSortParams: ({ columnId = undefined, sortType = undefined } = {}) => {
        if (isMounted.current) {
          setActiveSort((oldParams) => {
            const resultParams = { ...oldParams };

            if (columnId !== undefined) {
              resultParams.col = columnId;
            }

            if (sortType !== undefined) {
              resultParams.type = sortType;
            }

            return resultParams;
          });
        }
      },
      updateHideColumns: (arr) => {
        setInitialOptionStates(arr, 'hide');
      },
      closeContextMenu: () => {
        setCustomContextInfo({ target: null, x: null, y: null });
      }
    }));
    // IMPERATIVE ACTIONS ===========================================

    if (!render) {
      return null;
    }

    // const tableIsRenderable = calculatedColumnProp !== null && showData !== null && componentSizes.width !== null;
    const tableIsRenderable = mainContainerRef.current !== null;

    return (
      <div
        id={tableId}
        className={mainClassName}
        ref={mainContainerRef}
        data-inconeltable-theme={theme}
        style={{ fontSize: `${fontSize}px`, height: `${dynamicRowCount ? '100%' : 'auto'}`, fontFamily }}
      >
        <div
          className={`${rootCls}-frame`}
          style={{ height: dynamicRowCount ? `${componentSizes.height}px` : 'auto' }}
          onContextMenu={customContextAction && customContextEnabled ? handleContextClick : null}
        >
          {tableIsRenderable && (
            <InconelTablePropsContext.Provider
              value={{
                tableId,
                columnOrderArray,
                pinLeftArray,
                pinRightArray,
                hideArray,
                setInitialOptionStates,
                columns: calculatedColumnProp.columns,
                maxLevel: calculatedColumnProp.maxLevel,
                dragEnabled: dragEnabledProp,
                pinEnabled: pinEnabledProp,
                pageSize: pageSizeProps,
                headerHeight,
                cellHeight,
                getLanguageText,
                convertUpperCase,
                totalDataLength,
                setPinAndDragStates,
                validData: validData.current,
                autoResizeColumns,
                showGroupBorders,
                componentWidth: componentSizes.width,
                maxTableHeight: maxTableHeightProp,
                equalRowHeight,
                cellPadding: cellPaddingProp,
                headerPadding: headerPaddingMemo,
                hoverEffect,
                updateEffect,
                theme,
                showData: showData ?? [],
                fullData,
                fontFamily,
                fontSize,
                tableHeight,
                systemColumnsWidth,
                eventManagement: eventManagementProp,
                scrollable: scrollableParams,
                pagination: paginationParams,
                sorting: sortingParams,
                filtering: filteringParams,
                rowSpan: rowSpanParams,
                settingSave: settingSaveParams,
                footerIsEnabled: calculatedColumnProp.footerIsEnabled,
                showedDataLength: showedDataLength.current,
                defaultColumnOrder: initialOptionsMemo.columnOrder,
                mainComponentElement: mainContainerRef.current,
                updatedRowsObject,
                resetUpdatedRowsObject,
                conditionalStyling,
                selection: selectionParams,
                accordion: accordionParams,
                dataLoadedFirstTime: dataLoadedFirstTime.current,
                setHorizontalScrollVisible,
                customFooterHeight
              }}
            >
              {toolbarProp.enabled && <InconelTableToolbar toolbarObject={toolbarProp} />}

              <InconelTableBody
                rowStartIndex={rowStartIndex}
                tableResetIndex={tableResetIndex.current}
                setTableResetIndex={setTableResetIndex}
                tableResetVerticalScroll={tableResetVerticalScroll.current}
                setTableResetVerticalScroll={setTableResetVerticalScroll}
              />
              {customContextInfo.target && (
                <CustomContextMenu
                  key={`context-${customContextInfo.x}-${customContextInfo.y}`}
                  target={customContextInfo.target}
                  posX={customContextInfo.x}
                  posY={customContextInfo.y}
                  closeAction={() => setCustomContextInfo({ target: null, x: null, y: null })}
                  contentAction={customContextAction}
                />
              )}
            </InconelTablePropsContext.Provider>
          )}
        </div>
      </div>
    );
  }
);

InconelTable.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string,
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      tooltip: PropTypes.string,
      dataKey: PropTypes.string,
      cellClassName: PropTypes.string,
      headerClassName: PropTypes.string,
      drag: PropTypes.bool,
      locked: PropTypes.bool,
      pinAccess: PropTypes.oneOf([
        INCONELTABLE_PIN_ACCESS_LEFT,
        INCONELTABLE_PIN_ACCESS_RIGHT,
        INCONELTABLE_PIN_ACCESS_BOTH,
        INCONELTABLE_PIN_ACCESS_NONE
      ]),
      minWidth: PropTypes.number,
      maxWidth: PropTypes.number,
      cell: PropTypes.func,
      footer: PropTypes.func,
      hideMenuSelectable: PropTypes.bool,
      hideMenuVisible: PropTypes.bool,

      cellHorizontalAlign: PropTypes.oneOf([
        INCONELTABLE_HORIZONTAL_ALIGNMENT_LEFT,
        INCONELTABLE_HORIZONTAL_ALIGNMENT_CENTER,
        INCONELTABLE_HORIZONTAL_ALIGNMENT_RIGHT
      ]),
      cellVerticalAlign: PropTypes.oneOf([
        INCONELTABLE_VERTICAL_ALIGNMENT_TOP,
        INCONELTABLE_VERTICAL_ALIGNMENT_CENTER,
        INCONELTABLE_VERTICAL_ALIGNMENT_BOTTOM
      ]),
      headerJsx: PropTypes.func,
      editCellValue: PropTypes.func,
      renderAsHTML: PropTypes.bool
    })
  ).isRequired,
  mergedColumns: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string,
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      tooltip: PropTypes.string,
      cols: PropTypes.array,
      headerClassName: PropTypes.string,
      drag: PropTypes.bool,
      locked: PropTypes.bool,
      pinAccess: PropTypes.oneOf([
        INCONELTABLE_PIN_ACCESS_LEFT,
        INCONELTABLE_PIN_ACCESS_RIGHT,
        INCONELTABLE_PIN_ACCESS_BOTH,
        INCONELTABLE_PIN_ACCESS_NONE
      ]),
      cellHorizontalAlign: PropTypes.oneOf([
        INCONELTABLE_HORIZONTAL_ALIGNMENT_LEFT,
        INCONELTABLE_HORIZONTAL_ALIGNMENT_CENTER,
        INCONELTABLE_HORIZONTAL_ALIGNMENT_RIGHT
      ]),
      cellVerticalAlign: PropTypes.oneOf([
        INCONELTABLE_VERTICAL_ALIGNMENT_TOP,
        INCONELTABLE_VERTICAL_ALIGNMENT_CENTER,
        INCONELTABLE_VERTICAL_ALIGNMENT_BOTTOM
      ]),
      headerJsx: PropTypes.func
    })
  ),
  initialOptions: PropTypes.exact({
    columnOrder: PropTypes.arrayOf(PropTypes.string),
    pinLeft: PropTypes.arrayOf(PropTypes.string),
    pinRight: PropTypes.arrayOf(PropTypes.string),
    hide: PropTypes.arrayOf(PropTypes.string),
    hideOnChange: PropTypes.func
  }),
  toolbar: PropTypes.exact({
    enabled: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    showDataCountText: PropTypes.bool,
    exportButton: PropTypes.bool,
    hideButton: PropTypes.bool,
    settingsButton: PropTypes.bool,
    fileExtensions: PropTypes.array,
    exportFunction: PropTypes.func,
    panelHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([INCONELTABLE_AUTO])]),
    titleAreaLeftJsx: PropTypes.any,
    titleAreaRightJsx: PropTypes.any,
    buttonAreaLeftJsx: PropTypes.any,
    buttonAreaRightJsx: PropTypes.any
  }),
  pageSize: PropTypes.exact({
    rowCount: PropTypes.number,
    displayedRowCount: PropTypes.number,
    showCombobox: PropTypes.bool,
    options: PropTypes.array,
    pageSizeChange: PropTypes.func,
    dynamicRowCount: PropTypes.bool,
    comboPosition: PropTypes.oneOf(['top', 'bottomLeft', 'bottomRight']),
    addMissingRows: PropTypes.bool
  }),
  dragEnabled: PropTypes.bool,
  pinEnabled: PropTypes.bool,
  autoResizeColumns: PropTypes.bool,
  settingSave: PropTypes.exact({
    enabled: PropTypes.bool,
    isActive: PropTypes.bool,
    storageId: PropTypes.string
  }),
  updateEffect: PropTypes.bool,
  hoverEffect: PropTypes.bool,
  showGroupBorders: PropTypes.bool,
  headerHeight: PropTypes.number,
  cellHeight: PropTypes.number,
  customFooterHeight: PropTypes.number,
  maxTableHeight: PropTypes.number,
  cellPadding: PropTypes.exact({
    horizontal: PropTypes.number,
    vertical: PropTypes.number
  }),
  headerPadding: PropTypes.exact({
    horizontal: PropTypes.number,
    vertical: PropTypes.number
  }),
  equalRowHeight: PropTypes.bool,
  eventManagement: PropTypes.exact({
    activeCols: PropTypes.arrayOf(PropTypes.string),
    passiveCols: PropTypes.arrayOf(PropTypes.string),
    onCellClick: PropTypes.func,
    onCellDoubleClick: PropTypes.func,
    onCellMouseDown: PropTypes.func,
    onCellMouseUp: PropTypes.func,
    onCellMouseEnter: PropTypes.func,
    onCellMouseLeave: PropTypes.func,
    onCellMouseMove: PropTypes.func,
    onCellContextMenu: PropTypes.func
  }),
  fullData: PropTypes.bool,
  pagination: PropTypes.exact({
    activePage: PropTypes.number,
    enabled: PropTypes.bool,
    disabled: PropTypes.bool,
    dataCount: PropTypes.number,
    onPageChange: PropTypes.func
  }),
  scrollable: PropTypes.exact({
    enabled: PropTypes.bool,
    loadMoreShow: PropTypes.bool,
    loadMoreAction: PropTypes.func
  }),
  selection: PropTypes.exact({
    enabled: PropTypes.bool,
    selectedRows: PropTypes.array,
    showCheckboxColumn: PropTypes.bool,
    showSelectAll: PropTypes.bool,
    activeCols: PropTypes.arrayOf(PropTypes.string),
    passiveCols: PropTypes.arrayOf(PropTypes.string),
    multipleRowSelect: PropTypes.bool,
    preventDeselect: PropTypes.bool,
    allPageSelect: PropTypes.bool,
    onChange: PropTypes.func,
    selectActiveAction: PropTypes.func
  }),
  sorting: PropTypes.exact({
    enabled: PropTypes.bool,
    sortingAction: PropTypes.func,
    activeCols: PropTypes.arrayOf(PropTypes.string),
    passiveCols: PropTypes.arrayOf(PropTypes.string),
    columnId: PropTypes.oneOfType([PropTypes.string]),
    sortType: PropTypes.oneOf([INCONELTABLE_SORT_ASC, INCONELTABLE_SORT_ASC_UPPER, INCONELTABLE_SORT_DESC, INCONELTABLE_SORT_DESC_UPPER]),
    isClearable: PropTypes.bool
  }),
  filtering: PropTypes.exact({
    enabled: PropTypes.bool,
    activeCols: PropTypes.arrayOf(PropTypes.string),
    passiveCols: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
    dataProviderObject: PropTypes.object,
    customFilterFunction: PropTypes.func,
    showBubbles: PropTypes.bool,
    filterButtonShow: PropTypes.bool,
    customBubbleCountsObject: PropTypes.object,
    windowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([INCONELTABLE_AUTO])]),
    showFilterIconsOnStart: PropTypes.bool
  }),
  accordion: PropTypes.exact({
    enabled: PropTypes.bool,
    subDataKey: PropTypes.string,
    activeCols: PropTypes.arrayOf(PropTypes.string),
    passiveCols: PropTypes.arrayOf(PropTypes.string),
    dataProviderFunction: PropTypes.func,
    customJsxFunction: PropTypes.func,
    customHeight: PropTypes.number,
    onOpen: PropTypes.func,
    onClose: PropTypes.func
  }),
  rowSpan: PropTypes.exact({
    enabled: PropTypes.bool,
    activeCols: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.array])),
    passiveCols: PropTypes.arrayOf(PropTypes.string),
    customFnc: PropTypes.func
  }),
  conditionalStyling: PropTypes.array,
  customLanguageTexts: PropTypes.exact({
    [INCONELTABLE_LANG_TR]: PropTypes.objectOf(PropTypes.string),
    [INCONELTABLE_LANG_EN]: PropTypes.objectOf(PropTypes.string)
  }),
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  lang: PropTypes.oneOf([INCONELTABLE_LANG_TR, INCONELTABLE_LANG_EN]),
  theme: PropTypes.oneOf([INCONELTABLE_THEME_LIGHT, INCONELTABLE_THEME_DARK]),
  render: PropTypes.bool,
  customContextAction: PropTypes.func,
  customContextEnabled: PropTypes.bool
};

export default InconelTable;

/*
  $COL["9"] === $SRC[direction]
	
  conditionalStyling={{
    buyAmount: {
      operator: '<>',  // =, <, <=, >, >=, <>
      value1: '20',
      value2: '75',
      className: 'ozel-sinif',
      reversed: false,
      effectRow: false
    },
    contract: {
      operator: '=',  // =, <, <=, >, >=, <>
      value1: 'EBW0003',
      className: 'ozel-sinif',
      reversed: false,
      effectRow: false
    }
  	
  	
  }}
	
*/
