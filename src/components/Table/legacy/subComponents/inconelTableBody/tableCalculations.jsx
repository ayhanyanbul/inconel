import { INCONELTABLE_MAIN_CLASSNAME, INCONELTABLE_SORT_DESC } from '../constants';
import { getElementRect, getSectionWidths, isValidVariable, itemIsGroup, setExtraWidths, sortArray } from '../utils';

const rootCls = INCONELTABLE_MAIN_CLASSNAME;

const calculateSectionDom = ({
  sectionType = 'left',
  sectionArray = [],
  holderWidth = 0,
  contentWidth = 0,
  propsObject = {},
  averageLevelHeight = 0,
  mainComponentElement = null,
  visibleColumns = {},
} = {}) => {
  // sectionType 	-> left, center, right

  if (holderWidth > 0) {
    const headerMainElement = mainComponentElement.querySelector(`.${rootCls}-header`);

    const sectionHolder = mainComponentElement.querySelector(`.${rootCls}-header-${sectionType}`);
    const sectionContent = mainComponentElement.querySelector(`.${rootCls}-header-${sectionType}-content`);

    sectionHolder.style.width = `${holderWidth}px`;
    sectionContent.style.width = `${contentWidth}px`;

    let positionX = 0;

    sectionArray.forEach((colId) => {
      if (visibleColumns[colId] !== undefined) {
        const groupIdList = Object.values(visibleColumns[colId].groupIdList);
        // groupIdList: { "1": ["m2"], "2": ["m0", "m1", 4], "3":[1, 2, 3] }

        groupIdList.forEach((subList) => {
          let subPositionX = positionX;

          subList.forEach((subId) => {
            const headerItemElement = headerMainElement.querySelector(`.${rootCls}-header-item-id-${subId}`);
            // console.log(subId, visibleColumns[subId], averageLevelHeight);

            headerItemElement.style.width = `${propsObject[subId].width}px`;
            headerItemElement.style.height = `${visibleColumns[subId].unitHeight * averageLevelHeight}px`;
            headerItemElement.style.transform = `translate(${subPositionX}px, ${
              (visibleColumns[subId].level - 1) * averageLevelHeight
            }px)`;

            subPositionX += propsObject[subId].width;
          });
        });

        // console.log(sectionType, propsObject, sectionArray, visibleColumns);
        positionX += propsObject[colId].width;
      }
    });
  }
};

const getHeaderElementSizes = ({ keyId, mainComponentElement } = {}) => {
  const tableMainElement = mainComponentElement.querySelector(`.${rootCls}-table-container`);
  const headerContent = tableMainElement.querySelector(
    `.${rootCls}-header-item-id-${keyId} .${rootCls}-header-item-text`,
  );

  const elmObject = getElementRect(headerContent);

  if (elmObject === null) {
    return { width: 0, height: 0 };
  }

  return { width: Math.ceil(elmObject.width), height: Math.ceil(elmObject.height) };
};

const getFooterElementSizes = (footerElm) => {
  const result = { width: 0, height: 0 };
  if (footerElm === null) {
    return result;
  }

  const footerSpan = footerElm.querySelector('span');
  if (footerSpan !== null) {
    const elmObject = getElementRect(footerSpan);

    return { width: elmObject.width, height: elmObject.height };
  }

  return result;
};

const calculateMergedColumnSizes = ({
  elementPropsObject = {},
  groupKeys = [],
  visibleColumns = {},
  cellPadding = {},
  mainComponentElement = null,
} = {}) => {
  let widthVal = 0;

  groupKeys.forEach((keyId) => {
    let groupTotalWidth = 0;
    const headerSizeObject = getHeaderElementSizes({ keyId, mainComponentElement });

    visibleColumns[keyId].groupIdList[2].forEach((groupId) => {
      groupTotalWidth += elementPropsObject[groupId].width;
    });

    widthVal = Math.max(headerSizeObject.width + cellPadding.horizontal, groupTotalWidth);

    elementPropsObject[keyId] = {
      width: widthVal,
      height: headerSizeObject.height,
      maxWidth: null,
    };
  });

  return elementPropsObject;
};

const calculateColumnSizes = ({
  elementPropsObject = {},
  colKeys = [],
  mainComponentElement = null,
  cellPadding,
  headerPadding,
  visibleColumns = {},
  footerIsEnabled = false,
  sortingColList = [],
  filteringColList = [],
  colWidthList = {},
  customFooterHeight = null,
} = {}) => {
  const footerMainElement = mainComponentElement.querySelector(`.${rootCls}-footer`);
  let footerHeight = 0;
  let widthVal = 0;
  let maxWidthVal = 0;
  let minWidthVal = 0;

  colKeys.forEach((keyId) => {
    const headerSizeObject = getHeaderElementSizes({ keyId, mainComponentElement });
    widthVal = headerSizeObject.width + headerPadding.horizontal;
    widthVal += sortingColList.includes(keyId) || filteringColList.includes(keyId) ? 34 : 0;

    if (!itemIsGroup(keyId)) {
      // const cellElementArray = tableMainElement.querySelectorAll(`.${rootCls}-cell-item-id-${keyId}`);

      // maxWidthVal = columns[keyId].maxWidth;
      maxWidthVal = visibleColumns[keyId].maxWidth;
      minWidthVal = visibleColumns[keyId].minWidth;

      // footer calc
      if (footerIsEnabled && footerMainElement !== null) {
        const footerElm = footerMainElement.querySelector(`.${rootCls}-cell-item-${keyId}`);
        if (footerElm !== null) {
          const footerSize = getFooterElementSizes(footerElm);
          widthVal = Math.max(widthVal, footerSize.width + cellPadding.horizontal);
          widthVal = maxWidthVal !== null ? Math.min(maxWidthVal, widthVal) : widthVal;

          if (customFooterHeight) {
            footerHeight = customFooterHeight;
          } else {
            footerHeight = Math.max(footerHeight, footerSize.height);
          }
        }
      }

      // footer calc
      let prevWidthFromCache = 0;

      if (isValidVariable(colWidthList?.[keyId])) {
        prevWidthFromCache = colWidthList[keyId];
      } else {
        // önceden gizli olup, sonradan görünen kolon
        const cellList = mainComponentElement.querySelectorAll(`.inconeltable-cell-item-${keyId} > span`);
        cellList.forEach((cellItem) => {
          prevWidthFromCache = Math.max(getElementRect(cellItem).width + cellPadding.horizontal, prevWidthFromCache);
        });
      }

      widthVal = Math.max(prevWidthFromCache, widthVal);
      widthVal = maxWidthVal !== null ? Math.min(widthVal, maxWidthVal) : widthVal;
      widthVal = minWidthVal !== null ? Math.max(widthVal, minWidthVal) : widthVal;

      // widthVal = maxWidthVal !== null ? Math.min(maxWidthVal, prevWidthFromCache) : Math.max(prevWidthFromCache, widthVal);
    } else {
      let groupTotalWidth = 0;
      visibleColumns[keyId].groupIdList[2].forEach((groupId) => {
        groupTotalWidth += elementPropsObject[groupId].width;
      });

      widthVal = Math.max(widthVal, groupTotalWidth);
    }

    elementPropsObject[keyId] = {
      width: widthVal,
      height: headerSizeObject.height + headerPadding.vertical,
      maxWidth: visibleColumns[keyId].maxWidth,
    };
  });

  return { elementPropsObject, footerHeight };
};

const calculateResizeValues = ({
  elementPropsObject = {},
  colKeys = [],
  autoResizeColumns = true,
  visibleColumns = {},
  componentWidth = 0,
} = {}) => {
  if (autoResizeColumns) {
    // columnOrderArray, visibleColumns

    const currentTotalWidth = colKeys.reduce((total, item) => {
      const increase = Object.keys(visibleColumns).includes(String(item)) ? elementPropsObject[item].width : 0;

      return total + increase;
    }, 0);

    const extraWidth = componentWidth - currentTotalWidth; // kapsayıcı div'den fazla kalan width px

    if (extraWidth > 0) {
      elementPropsObject = setExtraWidths(elementPropsObject, extraWidth);
    }
  }

  return elementPropsObject;
};

// bileşik kolonlar içinde kısa kalan kolon varsa işlem yap
const checkMergedContentIsShort = (propObject, groupKeys, colProps) => {
  // console.log('log', propObject);

  groupKeys.forEach((groupKey) => {
    const childrenIdList = colProps[groupKey].groupIdList[2];
    let subTotal = 0;

    if (Array.isArray(childrenIdList)) {
      subTotal = childrenIdList.reduce((total, childId) => total + propObject[childId].width, 0);
    }

    if (subTotal > 0) {
      const diff = propObject[groupKey].width - subTotal;
      if (diff > 0) {
        propObject = setExtraWidths(propObject, diff, childrenIdList);
      }
    }
  });

  return propObject;
};

// ====================================================================================================================================
// ====================================================== CALCULATE DOM / RESIZE ======================================================
// ====================================================================================================================================
export const calculateTableDom = ({
  mainComponentElement = null,
  visibleColumns = {},
  leftIdList = [],
  centerIdList = [],
  rightIdList = [],
  componentWidth = 0,
  autoResizeColumns = true,
  maxLevel = 0,
  headerHeight = 0,
  cellHeight = 0,
  equalRowHeight = false,
  footerIsEnabled,
  cellPadding,
  headerPadding,
  sortingColList,
  filteringColList,
  systemColumnsWidth,
  colWidthList,
  customFooterHeight,
} = {}) => {
  if (mainComponentElement === null) {
    return null;
  }

  componentWidth -= systemColumnsWidth;

  const pinCenterArray = centerIdList;
  const keyListTopLevel = sortArray(visibleColumns, 'level', INCONELTABLE_SORT_DESC); // hi to low

  let elementPropsObject = {}; // m0: {width:100, height:45}
  let rowHeightsArray = []; // [30, 30, 30, 30, 30, 30, 30, 30]
  let footerHeight = 0;

  const groupKeys = [];
  const colKeys = [];
  let i = 0;

  keyListTopLevel.forEach((colId) => {
    if (itemIsGroup(colId)) {
      groupKeys.push(colId);
    } else {
      colKeys.push(colId);
    }
  });

  // KOLON GENİŞLİK VE YÜKSEKLİKLERİNİ HESAPLA
  const columnCalcObj = calculateColumnSizes({
    elementPropsObject,
    colKeys,
    mainComponentElement,
    cellPadding,
    headerPadding,
    visibleColumns,
    footerIsEnabled,
    sortingColList,
    filteringColList,
    colWidthList,
    customFooterHeight,
  });

  footerHeight = columnCalcObj.footerHeight < cellHeight ? cellHeight : columnCalcObj.footerHeight;
  // footerHeight = footerHeight > cellHeight * 2 ? cellHeight * 2 : footerHeight;

  elementPropsObject = columnCalcObj.elementPropsObject;

  // PENCERE ÖLÇÜLERİNE GÖRE YENİ ÖLÇÜLERİ HESAPLA
  elementPropsObject = calculateResizeValues({
    elementPropsObject,
    colKeys,
    autoResizeColumns,
    visibleColumns,
    componentWidth,
  });

  // BİRLEŞİK KOLON GENİŞLİK VE YÜKSEKLİK HESAPLA
  elementPropsObject = calculateMergedColumnSizes({
    elementPropsObject,
    groupKeys,
    visibleColumns,
    cellPadding,
    mainComponentElement,
  });

  elementPropsObject = checkMergedContentIsShort(elementPropsObject, groupKeys, visibleColumns);

  const leftContentWidth = leftIdList.reduce((total, colId) => {
    total += elementPropsObject[colId]?.width !== undefined ? elementPropsObject[colId].width : 0;
    return total;
  }, 0);

  const centerContentWidth = pinCenterArray.reduce((total, colId) => {
    total += elementPropsObject[colId]?.width !== undefined ? elementPropsObject[colId].width : 0;
    return total;
  }, 0);

  const rightContentWidth = rightIdList.reduce((total, colId) => {
    total += elementPropsObject[colId]?.width !== undefined ? elementPropsObject[colId].width : 0;
    return total;
  }, 0);

  const sectionWidths = getSectionWidths({
    left: leftContentWidth,
    center: centerContentWidth,
    right: rightContentWidth,
    total: componentWidth,
  });

  const leftHolderWidth = sectionWidths.left;
  const centerHolderWidth = sectionWidths.center;
  const rightHolderWidth = sectionWidths.right;

  const headerLevelsObject = {}; // { "1":30, "2":25, "3":30 }
  for (i = 1; i <= maxLevel; i++) {
    headerLevelsObject[i] = headerHeight;
  }

  keyListTopLevel.forEach((colId) => {
    const { level, unitHeight } = visibleColumns[colId];
    const currentHeight = elementPropsObject[colId].height;
    const levelHeight = headerLevelsObject[level];

    const heightLimit = unitHeight * levelHeight;

    if (currentHeight > heightLimit) {
      const extraHeightPerLevel = Math.ceil((currentHeight - heightLimit) / unitHeight);

      for (i = level; i < level + unitHeight; i++) {
        headerLevelsObject[i] = Math.max(headerLevelsObject[i], headerHeight + extraHeightPerLevel);
      }
    }

    // console.log(colId, level, unitHeight, currentHeight);
  });

  const averageLevelHeight = Math.max(...Object.values(headerLevelsObject));
  const headerHolderHeight = averageLevelHeight * maxLevel;

  // DOM MANIPULATIONS ================================================================================

  // HEADER MANIPULATION
  let headerCursorX = systemColumnsWidth;

  const headerMainElement = mainComponentElement.querySelector(`.${rootCls}-header`);

  if (headerMainElement !== null) {
    headerMainElement.style.height = `${headerHolderHeight}px`;
  }

  if (leftHolderWidth > 0) {
    const headerCenterElement = mainComponentElement.querySelector(`.${rootCls}-header-left`);
    headerCenterElement.style.transform = `translateX(${headerCursorX}px)`;
    headerCursorX += leftHolderWidth;
  }

  if (centerHolderWidth > 0) {
    const headerCenterElement = mainComponentElement.querySelector(`.${rootCls}-header-center`);
    headerCenterElement.style.transform = `translateX(${headerCursorX}px)`;
    headerCursorX += centerHolderWidth;
  }

  if (rightHolderWidth > 0) {
    const headerRightElement = mainComponentElement.querySelector(`.${rootCls}-header-right`);
    headerRightElement.style.transform = `translateX(${headerCursorX}px)`;
  }

  calculateSectionDom({
    sectionType: 'left',
    sectionArray: leftIdList,
    holderWidth: leftHolderWidth,
    contentWidth: leftContentWidth,
    propsObject: elementPropsObject,
    averageLevelHeight,
    mainComponentElement,
    visibleColumns,
  });

  calculateSectionDom({
    sectionType: 'center',
    sectionArray: pinCenterArray,
    holderWidth: centerHolderWidth,
    contentWidth: centerContentWidth,
    propsObject: elementPropsObject,
    averageLevelHeight,
    mainComponentElement,
    visibleColumns,
  });

  calculateSectionDom({
    sectionType: 'right',
    sectionArray: rightIdList,
    holderWidth: rightHolderWidth,
    contentWidth: rightContentWidth,
    propsObject: elementPropsObject,
    averageLevelHeight,
    mainComponentElement,
    visibleColumns,
  });

  if (equalRowHeight) {
    const maxRowHeight = Math.max(...rowHeightsArray);
    rowHeightsArray = rowHeightsArray.map(() => maxRowHeight);
  }

  // FOOTER MANIPULATION

  if (footerIsEnabled) {
    const mainFooterElement = mainComponentElement.querySelector(`.${rootCls}-footer`);

    if (mainFooterElement !== null) {
      mainFooterElement.style.height = `${footerHeight}px`;

      // LEFT =========
      const footerLeftElement = mainComponentElement.querySelector(`.${rootCls}-footer-left`);

      if (footerLeftElement !== null) {
        const footerLeftContentElement = footerLeftElement.querySelector(`.${rootCls}-footer-left-content`);

        if (footerLeftContentElement !== null) {
          footerLeftContentElement.style.height = `${footerHeight}px`;
        }

        footerLeftElement.style.transform = `translateX(${systemColumnsWidth}px)`;

        const leftFooterElement = footerLeftElement.querySelector(`.${rootCls}-footer-item`);

        leftFooterElement.style.height = `${footerHeight}px`;
      }
      // LEFT =========

      // CENTER =========
      const footerCenterElement = mainComponentElement.querySelector(`.${rootCls}-footer-center`);

      if (footerCenterElement !== null) {
        const footerCenterContentElement = footerCenterElement.querySelector(`.${rootCls}-footer-center-content`);

        if (footerCenterContentElement !== null) {
          footerCenterContentElement.style.height = `${footerHeight}px`;
        }

        footerCenterElement.style.transform = `translateX(${systemColumnsWidth + leftHolderWidth}px)`;

        const centerFooterElement = footerCenterElement.querySelector(`.${rootCls}-footer-item`);

        centerFooterElement.style.height = `${footerHeight}px`;
      }
      // CENTER =========

      // RIGHT =========
      const footerRightElement = mainComponentElement.querySelector(`.${rootCls}-footer-right`);

      if (footerRightElement !== null) {
        const footerRightContentElement = footerRightElement.querySelector(`.${rootCls}-footer-right-content`);

        if (footerRightContentElement !== null) {
          footerRightContentElement.style.height = `${footerHeight}px`;
        }

        footerRightElement.style.transform = `translateX(${
          systemColumnsWidth + leftHolderWidth + centerHolderWidth
        }px)`;

        const rightFooterElement = footerRightElement.querySelector(`.${rootCls}-footer-item`);

        rightFooterElement.style.height = `${footerHeight}px`;
      }
      // RIGHT =========
    }
  }

  // FOOTER MANIPULATION

  return {
    elementPropsObject,
    tableSectionSizes: {
      rightContentWidth,
      rightHolderWidth,
      centerContentWidth,
      centerHolderWidth,
      leftContentWidth,
      leftHolderWidth,
      headerHolderHeight,
    },
  };
}; // end of calculate dom
