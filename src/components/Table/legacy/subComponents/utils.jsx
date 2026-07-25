/* eslint-disable no-new-func */
/* eslint-disable radix */

import React from 'react';
import { defaultColumnItemProps, defaultMergedColumnItemProps } from '../defaultProps';
import {
  INCONELTABLE_ROW_INDEX,
  INCONELTABLE_ROW_TEXTS,
  INCONELTABLE_SORT_ASC,
  INCONELTABLE_SORT_DESC,
  INCONELTABLE_ROW_ACCORDION_INDEX,
  INCONELTABLE_ROW_ACCORDION_CUSTOM,
  INCONELTABLE_ROW_VALUES,
  INCONELTABLE_ROW_ROWSPAN,
  INCONELTABLE_FILTER_EMPTY_VALUE
} from './constants';
// import cloneDeep from 'lodash/cloneDeep';

export const isValidVariable = (val) => val !== null && val !== undefined;

export const touchIsSupported = () => window.ontouchstart !== undefined;

export const clearSystemConstantsFromRow = (rowObject) => {
  if (!isObject(rowObject)) {
    return null;
  }
  const newObject = { ...rowObject };
  delete newObject?.[INCONELTABLE_ROW_INDEX];
  delete newObject?.[INCONELTABLE_ROW_ACCORDION_INDEX];
  delete newObject?.[INCONELTABLE_ROW_ACCORDION_CUSTOM];
  delete newObject?.[INCONELTABLE_ROW_TEXTS];
  delete newObject?.[INCONELTABLE_ROW_VALUES];
  delete newObject?.[INCONELTABLE_ROW_ROWSPAN];

  return newObject;
};

export const createFilterLookupFromArray = (arr) => {
  if (!Array.isArray(arr)) {
    return [];
  }

  return arr.map((item) => ({ label: String(item).trim(), value: item }));
};

export const getElementRect = (elm) => {
  if (elm === null) {
    return null;
  }

  const rect = elm.getBoundingClientRect();

  return {
    left: Math.floor(rect.left),
    top: Math.floor(rect.top),
    width: Math.floor(rect.width),
    height: Math.floor(rect.height)
  };
};

// === TABLE PROP VALIDATORS ======================================================
// ================================================================================

export const pinAndSortItemsValidator = (inputArr, columns) => {
  if (!Array.isArray(inputArr)) {
    return null;
  }

  return inputArr.filter((itemId) => columns?.[itemId]?.topElementId === null);
};

export const hideItemsValidator = (inputArr) => {
  if (!Array.isArray(inputArr)) {
    return null;
  }

  return inputArr.filter((itemId) => !itemIsGroup(itemId));
};

export const selectedRowsValidator = (selList) =>
  selList.filter((selId) => {
    if (!isValidVariable(selId) || isNaN(selId)) {
      return false;
    }

    /*
    if (selId < 0 || selId > totalDataLength - 1) {
      return false;
    }
		*/
    return true;
  });

export const getAllowedCols = (activeList, passiveList, columns) => {
  const allColList = columns.map((col) => col.id);
  let activeCols = Array.isArray(activeList)
    ? activeList.filter((col) => Array.isArray(col) || allColList.includes(col))
    : null;

  if (activeCols === null) {
    return [];
  }
  activeCols = activeCols.length === 0 ? [...allColList] : activeCols;

  let passiveCols = Array.isArray(passiveList) ? passiveList.filter((col) => allColList.includes(col)) : null;

  if (passiveCols === null) {
    return activeCols;
  }
  passiveCols = passiveCols.length === 0 ? [...allColList] : passiveCols;

  return [...activeCols].filter((col) => !Array.isArray(col) && !passiveCols.includes(col));
};

const getConditionResult = (fn) => new Function(`return ${fn}`)();

export const getConditionalString = ({ value = null, rowData = null, rowValues = null } = {}) => {
  let result = String(value);
  // COLUMN CONTROL
  result = result.replace(/\$COL\[.*?\]/g, (val) => {
    const raw = val.slice(5, -1);

    return isValidVariable(rowValues?.[raw]) ? rowValues[raw] : null;
  });

  result = result.replace(/\$SRC\[.*?\]/g, (val) => {
    const raw = val.slice(5, -1);

    return getValueFromSource({ source: rowData, path: raw, defaultValue: null });
  });

  return result;
};

export const checkConditionalStyles = (rowData, defaultObj, conditionList, rowValues) => {
  /* 
		defaultObj 			-> { '9':{ classList:[], style:{} } }
		conditionList 	-> [{ target: '9', effectRow: true, condition: `$COL[5] === $SRC[netPrice]`, action: 'ahmet' }]
	*/
  const result = { ...defaultObj };
  const resultIdList = Object.keys(result);
  let conditionSuccessFound = false;

  conditionList.forEach((item) => {
    const action = isValidVariable(item?.action) ? item.action : null;
    const effectRow = isValidVariable(item?.effectRow) ? Boolean(item.effectRow) : true;
    let target = isValidVariable(item?.target) ? String(item.target) : null;
    target = effectRow ? null : target;

    let conditionString = isValidVariable(item?.condition) ? String(item.condition) : null;

    if (action !== null && conditionString !== null) {
      // COLUMN CONTROL
      conditionString = conditionString.replace(/\$COL\[.*?\]/g, (val) => {
        const raw = val.slice(5, -1);
        let resVal = isValidVariable(rowValues?.[raw]) ? rowValues[raw] : null;
        resVal = isValidVariable(resVal) && !isNumber(resVal) && typeof resVal !== 'boolean' ? `'${resVal}'` : resVal;

        return resVal;
      });

      // SOURCE CONTROL
      conditionString = conditionString.replace(/\$SRC\[.*?\]/g, (val) => {
        const raw = val.slice(5, -1);
        let resVal = getValueFromSource({ source: rowData, path: raw, defaultValue: null });
        resVal = isValidVariable(resVal) && !isNumber(resVal) && typeof resVal !== 'boolean' ? `'${resVal}'` : resVal;

        return resVal;
      });

      if (getConditionResult(conditionString)) {
        conditionSuccessFound = true;
        const isObj = isObject(action);

        if (target === null) {
          // tüm satıra etki
          resultIdList.forEach((resId) => {
            if (isObj) {
              result[resId] = { ...result[resId], style: { ...result[resId].style, ...action } };
            } else {
              result[resId] = { ...result[resId], classList: [...result[resId].classList, action] };
            }
          });
        } else if (isObj) {
          result[target] = { ...result[target], style: { ...result[target].style, ...action } };
        } else {
          result[target] = { ...result[target], classList: [...result[target].classList, action] };
        }
      }
    }
  });

  return conditionSuccessFound ? result : null;
};

export const accordionDataValidator = ({ data = [], columns = [], accordionNo = 0 } = {}) => {
  if (!Array.isArray(data)) {
    return null;
  }

  const resultArray = [];
  let columnValue = '';

  data.forEach((dataItem, index) => {
    const rowTexts = {};
    const rowValues = {};

    if (isValidVariable(dataItem)) {
      // cols loop
      columns.forEach((colItem) => {
        const colId = colItem.id;
        const { editCellValue, dataKey } = colItem;
        columnValue = getValueFromSource({ source: dataItem, path: dataKey, defaultValue: null });
        rowValues[colId] = columnValue;

        columnValue =
          typeof editCellValue === 'function'
            ? editCellValue({ content: columnValue, rowData: dataItem, index })
            : columnValue;

        columnValue = isValidVariable(columnValue) ? String(columnValue) : columnValue;
        rowTexts[colId] = columnValue;
      }); // end of cols loop

      const rowResult = {
        ...dataItem,
        [INCONELTABLE_ROW_INDEX]: accordionNo,
        [INCONELTABLE_ROW_ACCORDION_INDEX]: index,
        [INCONELTABLE_ROW_TEXTS]: rowTexts,
        [INCONELTABLE_ROW_VALUES]: rowValues
      };

      resultArray.push(rowResult);
    } else {
      resultArray.push({
        [INCONELTABLE_ROW_INDEX]: accordionNo,
        [INCONELTABLE_ROW_ACCORDION_INDEX]: index,
        [INCONELTABLE_ROW_TEXTS]: null,
        [INCONELTABLE_ROW_VALUES]: null
      });
    }
  });

  return resultArray;
};

export const dataValidator = ({ prevData = [], newData = [], columns = [], rowStartIndex = 0 } = {}) => {
  const maxEffectedRowCount = 3;
  const resultArray = [];
  const filterPool = {}; // { '0':["ABC-1", "ABC-2"], '1':[0,1,2] }
  const updatedRowsObject = {}; // { 'rowNumber':["colId1", "colId2"] }

  let indexNo = rowStartIndex;
  let prevColumnValue = '';
  let columnValue = '';

  let updatedRowCount = 0;
  let effectCheckExists = prevData.length === newData.length;

  // INCONELTABLE_ROW_ROWSPAN

  columns.forEach((colItem) => {
    filterPool[colItem.id] = [];
  });

  newData.forEach((dataItem, index) => {
    const updatedCellIdList = [];

    if (isValidVariable(dataItem)) {
      const rowTexts = {};
      const rowValues = {};

      // cols loop
      columns.forEach((colItem) => {
        const colId = colItem.id;
        const { editCellValue, dataKey } = colItem;
        columnValue = getValueFromSource({ source: dataItem, path: dataKey, defaultValue: null });
        rowValues[colId] = columnValue;

        columnValue =
          typeof editCellValue === 'function'
            ? editCellValue({ content: columnValue, rowData: dataItem, index })
            : columnValue;

        columnValue = isValidVariable(columnValue) ? String(columnValue) : columnValue;

        // row update effect check
        if (effectCheckExists) {
          prevColumnValue = getValueFromSource({ source: prevData?.[index], path: dataKey, defaultValue: null });
          prevColumnValue =
            typeof editCellValue === 'function'
              ? editCellValue({ content: prevColumnValue, rowData: dataItem, index })
              : prevColumnValue;

          if (String(columnValue) !== String(prevColumnValue)) {
            updatedCellIdList.push(colId);
          }
        }

        rowTexts[colId] = columnValue;

        const finalColValue = isValidVariable(columnValue) ? columnValue : INCONELTABLE_FILTER_EMPTY_VALUE;

        if (!filterPool[colId].includes(finalColValue)) {
          filterPool[colId].push(finalColValue);
        }
      });
      // end of cols loop

      if (updatedCellIdList.length > 0) {
        updatedRowCount++;
        effectCheckExists = updatedRowCount > maxEffectedRowCount ? false : effectCheckExists;
        updatedRowsObject[indexNo] = updatedCellIdList;
      }

      const rowResult = {
        ...dataItem,
        [INCONELTABLE_ROW_INDEX]: indexNo,
        [INCONELTABLE_ROW_TEXTS]: rowTexts,
        [INCONELTABLE_ROW_VALUES]: rowValues
      };

      resultArray.push(rowResult);
    } else {
      resultArray.push({ [INCONELTABLE_ROW_INDEX]: indexNo, [INCONELTABLE_ROW_TEXTS]: null, [INCONELTABLE_ROW_VALUES]: null });
    }

    indexNo++;
  });

  return { resultArray, filterPool, updatedRowsObject: effectCheckExists ? updatedRowsObject : null };
};

const numberPropValidator = (val) => {
  if (!isValidVariable(val)) {
    return null;
  }

  if (isNaN(val)) {
    return null;
  }

  return parseFloat(val) < 0 ? null : parseFloat(val);
};

export const setColumnInitialValues = (columns) =>
  columns.map((item, index) => {
    const newItem = { ...item };
    newItem.id = isValidVariable(newItem.id) ? newItem.id : String(index);

    return newItem;
  });

export const initialOptionsValidator = (optionsObject, columns) => {
  // optionsObject = { columnOrder: [], pinLeft: [], pinRight: [], hide: [] };
  let { columnOrder } = optionsObject;
  const { pinLeft } = optionsObject;

  columnOrder =
    columnOrder.length === 0
      ? columns.map((col, index) => (isValidVariable(col.id) ? col.id : String(index)))
      : columnOrder;

  return { ...optionsObject, columnOrder, pinLeft };
};

const mergedColumnsValidator = (arr) => {
  // id, title, tooltip, cols, headerClassName, drag, locked, pinAccess, customJsx

  if (!Array.isArray(arr)) {
    return [];
  }

  const resultArray = arr.map((item, index) => {
    const newItem = { ...defaultMergedColumnItemProps, ...item };

    newItem.id = !isValidVariable(newItem.id) ? `m${index}` : String(newItem.id);

    return newItem;
  });

  return resultArray;
};

const columnsValidator = (arr) => {
  // id, title, tooltip, dataKey, cellClassName, headerClassName, drag, locked, pinAccess, minWidth, maxWidth, cell, footer, hideMenuSelectable, hideMenuVisible, customJsx

  if (!Array.isArray(arr)) {
    return [];
  }

  return arr.map((item, index) => {
    const newItem = { ...defaultColumnItemProps, ...item };
    // const dataKey = String(newItem.dataKey);
    // const uniqueKey = newItem.uniqueKey === null ? `inconeltable-col-${index}` : String(newItem.uniqueKey);

    // newItem.domKey = dataKey.includes('.') || dataKey.includes('[') ? uniqueKey : dataKey;
    newItem.id = !isValidVariable(newItem.id) ? String(index) : String(newItem.id);

    let { minWidth, maxWidth } = newItem;
    minWidth = numberPropValidator(minWidth);
    maxWidth = numberPropValidator(maxWidth);

    if (minWidth !== null && maxWidth !== null && minWidth > maxWidth) {
      minWidth = null;
      maxWidth = null;
    }

    newItem.minWidth = minWidth;
    newItem.maxWidth = maxWidth;

    return newItem;
  });
};

const getColumnsSubElementsList = ({ item = {}, pool = {}, list = {}, level = 1 } = {}) => {
  const { id, cols } = item;

  /*
		1: m2
		2: m0, m1, 4
		3: 0, 1, 2, 3
	*/

  if (Array.isArray(cols)) {
    let obj = {};
    list[level] = list[level] === undefined ? [id] : [...list[level], id];

    cols.forEach((row) => {
      obj = getColumnsSubElementsList({ item: pool[row], pool, list, level: level + 1 });
      list = obj.list;
    });
  } else {
    list[level] = list[level] === undefined ? [id] : [...list[level], id];
  }

  return { item, pool, list, level };
};

const getColumnsUnitHeight = ({ item = {}, pool = {}, maxLevel = 0 } = {}) => {
  const newItem = { ...item };
  const { id, cols, level } = newItem;
  const isGroup = itemIsGroup(id);
  newItem.unitHeight = Array.isArray(cols) && isGroup ? Math.abs(level - pool[cols[0]].level) : maxLevel - level + 1;

  return newItem;
};

const getColumnsLevels = ({ item = {}, pool = {} } = {}) => {
  const newItem = { ...item };
  const keysArray = Object.keys(pool);
  const poolTotal = keysArray.length;
  let currentId = item.id;
  let tempObject = {};

  let topElementItem = null;
  let loopVal = true;
  let level = 1;
  let i = 0;

  do {
    loopVal = false;
    for (i = 0; i < poolTotal; i++) {
      tempObject = pool[keysArray[i]];

      if (Array.isArray(tempObject.cols) && tempObject.cols.includes(currentId)) {
        loopVal = true;
        currentId = tempObject.id;
        topElementItem = tempObject;
        level++;
        break;
      }
    }
  } while (loopVal);

  newItem.topElementId = topElementItem === null ? null : topElementItem.id;
  newItem.level = level;

  return newItem;
};

export const generalColumnValidator = (columns, mergedColumns, columnOrder) => {
  const newColumns = columnsValidator(columns);
  const newMergedColumns = mergedColumnsValidator(mergedColumns);

  const resultObject = {};
  let itemObject = {};
  let maxLevel = 0;
  let groupIdList = [];
  let footerIsEnabled = false;

  [...newColumns, ...newMergedColumns].forEach((item) => {
    resultObject[item.id] = { ...item };

    if (!footerIsEnabled && !itemIsGroup(item.id) && typeof item?.footer === 'function') {
      footerIsEnabled = true;
    }
  });

  const keysArray = Object.keys(resultObject);

  keysArray.forEach((item) => {
    itemObject = getColumnsSubElementsList({ item: resultObject[item], pool: resultObject });
    groupIdList = itemObject.list;
    maxLevel = Math.max(maxLevel, Object.keys(groupIdList).length);

    const groupFlatList = [];
    Object.values(groupIdList).forEach((groupItem) => {
      groupFlatList.push(...groupItem);
    });

    resultObject[item].groupIdList = groupIdList;
    resultObject[item].groupFlatList = groupFlatList;
  });

  keysArray.forEach((item) => {
    resultObject[item] = getColumnsLevels({ item: resultObject[item], pool: resultObject });
  });

  keysArray.forEach((item) => {
    resultObject[item] = getColumnsUnitHeight({ item: resultObject[item], pool: resultObject, maxLevel });
  });

  const columnOrderExtended = [];
  columnOrder.forEach((orderId) => {
    columnOrderExtended.push(...resultObject[orderId].groupFlatList);
  });

  // order
  const resultKeys = Object.keys(resultObject);

  resultKeys.forEach((resId) => {
    if (!columnOrderExtended.includes(resultObject[resId].id)) {
      delete resultObject[resId];
    }
  });

  /*
		console.table(
			Object.values(resultObject).map(item => ({
				id: item.id,
				level: item.level,
				unitHeight: item.unitHeight,
				drag: JSON.stringify(item.groupIdList),
				top: item.topElementId,
			})),
		);
	*/

  return { columns: resultObject, maxLevel, footerIsEnabled };
};

export const itemIsGroup = (id) => {
  if (!isValidVariable(id)) {
    return false;
  }

  return String(id).substr(0, 1) === 'm';
};

export const itemIsVisible = (itemId, pool, hidedIdsArray) => {
  itemId = String(itemId);

  if (!itemIsGroup(itemId)) {
    return hidedIdsArray.find((item) => String(item) === itemId) === undefined;
  }

  const colsArray = pool[itemId].cols;
  if (Array.isArray(colsArray)) {
    const hidedCols = colsArray.filter((col) => !itemIsVisible(col, pool, hidedIdsArray));

    return hidedCols.length !== colsArray.length;
  }

  return false;
};

export const getVisibleColumns = (columns, hidedArray) => {
  const newColumnObject = {};
  let maxWidthAllowed = false;

  Object.keys(columns).forEach((item) => {
    if (itemIsVisible(item, columns, hidedArray)) {
      newColumnObject[item] = columns[item];
    }
  });

  const newColKeys = Object.keys(newColumnObject);

  let newList = {};
  let newGroupFlatList = [];

  newColKeys.forEach((item) => {
    newList = newColumnObject[item].groupIdList;
    newGroupFlatList = newColumnObject[item].groupFlatList;
    // console.log(item, newList);

    Object.keys(newList).forEach((g) => {
      newList[g] = newList[g].filter((sub) => newColKeys.includes(String(sub)));
      newGroupFlatList = newGroupFlatList.filter((sub) => newColKeys.includes(String(sub)));
    });

    newColumnObject[item].groupIdList = newList;
    newColumnObject[item].groupFlatList = newGroupFlatList;

    if (newColumnObject[item]?.maxWidth === null) {
      maxWidthAllowed = true;
    }
  });

  return [newColumnObject, maxWidthAllowed];
};

export const getDataOrderIds = (itemId, pool, resultArray = []) => {
  const isGroup = itemIsGroup(itemId);

  if (isGroup) {
    pool[itemId].cols.forEach((colItem) => {
      if (pool[colItem] !== undefined) {
        const subResult = getDataOrderIds(colItem, pool, []);
        resultArray = [...resultArray, ...subResult];
      }
    });
  } else {
    resultArray.push(itemId);
  }

  return resultArray;
};

// ================================================================================
// === TABLE PROP VALIDATORS ======================================================

export const getSectionWidths = (obj) => {
  const { left, center, right, total } = obj;
  let leftVal = obj.left;
  let centerVal = obj.center;
  let rightVal = obj.right;
  const nonZeroCount = [leftVal, centerVal, rightVal].filter((x) => x !== 0).length;

  if (nonZeroCount === 0) {
    return obj;
  }
  if (leftVal + centerVal + rightVal <= total) {
    return obj;
  }

  if (nonZeroCount === 1) {
    if (leftVal !== 0) {
      leftVal = total;
    } else if (centerVal !== 0) {
      centerVal = total;
    } else if (rightVal !== 0) {
      rightVal = total;
    }
  } else {
    const newTotal = total < 0 ? 0 : total;

    const widthArray = getDivideArrayFromTotal(newTotal, nonZeroCount);
    leftVal = leftVal !== 0 ? widthArray.splice(0, 1)[0] : leftVal;
    centerVal = centerVal !== 0 ? widthArray.splice(0, 1)[0] : centerVal;
    rightVal = rightVal !== 0 ? widthArray.splice(0, 1)[0] : rightVal;

    let leftOk = leftVal === 0;
    let centerOk = centerVal === 0;
    let rightOk = rightVal === 0;

    do {
      let diff = 0;
      const flowArray = [];

      if (!leftOk) {
        if (left < leftVal) {
          diff += leftVal - left;
          leftVal = left;
          flowArray.push(1);
        } else {
          leftOk = true;
        }
      }

      if (!centerOk) {
        if (center < centerVal) {
          diff += centerVal - center;
          centerVal = center;
          flowArray.push(2);
        } else {
          centerOk = true;
        }
      }

      if (!rightOk) {
        if (right < rightVal) {
          diff += rightVal - right;
          rightVal = right;
          flowArray.push(3);
        } else {
          rightOk = true;
        }
      }

      if (diff > 0) {
        const diffArray = getDivideArrayFromTotal(diff, nonZeroCount - flowArray.length);
        leftVal += flowArray.indexOf(1) === -1 && left > 0 ? diffArray.splice(0, 1)[0] : 0;
        centerVal += flowArray.indexOf(2) === -1 && center > 0 ? diffArray.splice(0, 1)[0] : 0;
        rightVal += flowArray.indexOf(3) === -1 && right > 0 ? diffArray.splice(0, 1)[0] : 0;
      }

      leftOk = left < leftVal ? false : leftOk;
      centerOk = center < centerVal ? false : centerOk;
      rightOk = right < rightVal ? false : rightOk;
    } while (!leftOk || !centerOk || !rightOk);
  }

  return { left: leftVal, center: centerVal, right: rightVal, total };
};

export const setExtraWidths = (propObject, extraWidth, allowedIdList = null) => {
  /*
		obj => {
			"1": {width: 326, height: 45, maxWidth: 500}
			"2": {width: 36, height: 30, maxWidth: null}
		}
	*/

  let unusedWidth = 0;
  let activeKeysForExtra = [];
  let disableMaxLength = false;
  let propKeyList = allowedIdList === null ? Object.keys(propObject) : allowedIdList;
  propKeyList = propKeyList.filter((keyId) => !itemIsGroup(keyId));

  propKeyList.forEach((keyId) => {
    if (propObject[keyId].maxWidth === null || propObject[keyId].width < propObject[keyId].maxWidth) {
      activeKeysForExtra.push(keyId);
    }
  });

  if (activeKeysForExtra.length === 0) {
    activeKeysForExtra = [...propKeyList];
    disableMaxLength = true;
  }

  const extraWidthsArray = getDivideArrayFromTotal(extraWidth, activeKeysForExtra.length);

  activeKeysForExtra.forEach((keyId, index) => {
    const subObject = propObject[keyId];
    const extraVal = extraWidthsArray[index];
    const { maxWidth } = subObject;

    if (maxWidth === null || disableMaxLength) {
      propObject[keyId].width += extraVal;
    } else {
      const newWidth = propObject[keyId].width + extraVal;

      if (newWidth >= maxWidth) {
        propObject[keyId].width = maxWidth;
        unusedWidth += newWidth - maxWidth;
      } else {
        propObject[keyId].width = newWidth;
      }
    }
  });

  if (unusedWidth > 0) {
    propObject = setExtraWidths(propObject, unusedWidth);
  }

  return propObject;
};

export const getDivideArrayFromTotal = (total, divideCount) => {
  /*
    total: 114, divideCount: 11   ->  [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 14]
  */

  const unitValue = Math.floor(total / divideCount);
  const restValue = total % divideCount;
  let resultArray = [];

  if (total === 0) {
    resultArray = [...Array(divideCount).fill(0)];
  } else if (total >= divideCount) {
    resultArray = [...Array(divideCount).fill(unitValue)];
    for (let i = 0; i < restValue; i++) {
      resultArray[i] += 1;
    }
  } else {
    resultArray = [...Array(total).fill(1), ...Array(divideCount - total).fill(0)];
  }

  return resultArray;
};

export const getJsxFromParam = (param) => {
  if (param === undefined) {
    return null;
  }

  if (Array.isArray(param)) {
    return param.map((item, index) => <React.Fragment key={index}>{item}</React.Fragment>);
  }

  if (typeof param === 'function') {
    return param();
  }

  return param;
};

export const getTranslateInfo = (elm) => {
  if (elm === null) {
    return 0;
  }
  // /translate\((.*?)px/g.exec(String(elm.style.transform))[1]

  const tanslateString = /\((.*?)\)/g.exec(String(elm.style.transform))[1]; // 0px, 0px
  const translateArray = tanslateString.split(',').map((item) => item.trim().slice(0, -2));

  return { x: parseFloat(translateArray[0]), y: parseFloat(translateArray[1]) };
};

export const getValueFromSource = ({ source = null, path = null, defaultValue = null } = {}) => {
  if (source === null || path === null) {
    return null;
  }

  const pattern = /\[(.*?)\]/g;
  const nodeList = String(path).split('.');
  let i = 0;
  let j = 0;
  let matches = [];
  let match;
  let item;
  let arrayKey = '';

  for (i = 0; i < nodeList.length; i++) {
    item = nodeList[i];
    matches = [];
    match = pattern.exec(item);

    while (match !== null) {
      matches.push(match[1]);
      match = pattern.exec(item);
    }

    if (matches.length === 0) {
      source = source?.[item];
    } else {
      arrayKey = item.substr(0, item.indexOf('['));

      source = arrayKey !== '' ? source?.[arrayKey] : source;

      for (j = 0; j < matches.length; j++) {
        source = source?.[matches[j]];
        if (source === undefined) {
          return defaultValue;
        }
      }
    }

    if (source === undefined) {
      return defaultValue;
    }
  }

  if (source === undefined) {
    return defaultValue;
  }

  return source;
};

export const isObject = (val) => isValidVariable(val) && !Array.isArray(val) && typeof val === 'object';

export const trLowerCase = (val) => {
  const letterList = { Ç: 'ç', Ğ: 'ğ', I: 'ı', İ: 'i', Ö: 'ö', Ş: 'ş', Ü: 'ü' };
  return val.replace(/(([ÇĞIİÖŞÜ]))/g, (letter) => letterList[letter]).toLowerCase();
};

export const enLowerCase = (val) => {
  const letterList = { I: 'i' };
  return val.replace(/(([I]))/g, (letter) => letterList[letter]).toLowerCase();
};

export const trUpperCase = (val) => {
  const letters = { ç: 'Ç', ğ: 'Ğ', ı: 'I', i: 'İ', ö: 'Ö', ş: 'Ş', ü: 'Ü' };

  return val.replace(/(([çğıiöşü]))/g, (letter) => letters[letter]).toUpperCase();
};

export const enUpperCase = (val) => {
  const letters = { i: 'I' };

  return val.replace(/(([i]))/g, (letter) => letters[letter]).toUpperCase();
};

export const compareValues = (val1, val2) => {
  const dataType = getDataType(val1);

  if (val1 !== null && val2 === null) {
    return 1;
  }
  if (val1 === null && val2 !== null) {
    return -1;
  }
  if (val1 === null && val2 === null) {
    return 0;
  }

  if (dataType === 'date') {
    return compareDates(val1, val2);
  }
  if (dataType === 'number') {
    return compareNumbers(val1, val2);
  }

  return compareStrings(val1, val2);
};

export const sortArray = (source, path, sortType = INCONELTABLE_SORT_ASC) => {
  // sortType   -> asc, desc
  if (!isValidVariable(source)) {
    return source;
  }

  const sourceType = Array.isArray(source) ? 'array' : typeof source;

  if (sourceType !== 'array' && sourceType !== 'object') {
    return source;
  }

  let compareResult = 0;
  let val1;
  let val2;

  if (sourceType === 'array') {
    return source.sort((a, b) => {
      val1 = path === '' ? a : getValueFromSource({ source: a, path, defaultValue: '' });
      val2 = path === '' ? b : getValueFromSource({ source: b, path, defaultValue: '' });

      compareResult = compareValues(val1, val2);
      compareResult = sortType === INCONELTABLE_SORT_DESC ? -1 * compareResult : compareResult;

      return compareResult;
    });
  }

  // for object type, return sorted key list
  return Object.keys(source).sort((a, b) => {
    val1 = path === '' ? source[a] : getValueFromSource({ source: source[a], path, defaultValue: '' });
    val2 = path === '' ? source[b] : getValueFromSource({ source: source[b], path, defaultValue: '' });

    compareResult = compareValues(val1, val2);
    compareResult = sortType === INCONELTABLE_SORT_DESC ? -1 * compareResult : compareResult;

    return compareResult;
  });
};

const isDate = (val) => {
  val = String(val);

  // 2020-12-23 10:45
  if (
    val.search(
      /^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):?([0-9]|[0-5][0-9])$/g
    ) !== -1
  ) {
    return true;
  }

  // 2020/12/23 10:45
  if (
    val.search(
      /^\d\d\d\d\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01]) (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):?([0-9]|[0-5][0-9])$/g
    ) !== -1
  ) {
    return true;
  }

  // 2020/12/23
  if (val.search(/^\d\d\d\d\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])$/g) !== -1) {
    return true;
  }

  // 2020-12-23
  if (val.search(/^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/g) !== -1) {
    return true;
  }

  return false;
};

export const isNumber = (val) => {
  if (!isValidVariable(val)) {
    return false;
  }

  return !isNaN(val);
};

const getDataType = (val) => {
  let result = 'string';

  if (isDate(val)) {
    result = 'date';
  } else if (isNumber(val)) {
    result = 'number';
  }
  return result;
};

const compareStrings = (val1, val2) => {
  const collator = new Intl.Collator('tr');

  return collator.compare(val1, val2);
};

const compareNumbers = (val1, val2) => {
  val1 = String(val1);
  val2 = String(val2);

  const num1 = parseFloat(val1.replace(/,/, '.'));
  const num2 = parseFloat(val2.replace(/,/, '.'));

  return num1 - num2;
};

const compareDates = (val1, val2) => new Date(val1) - new Date(val2);

export const getAllParentsClassList = ({ startElement = null, endElement = null, list = [] } = {}) => {
  list = [...startElement.classList];

  const parentElm = startElement.parentNode;

  if (parentElm !== endElement) {
    const parentClassList = getAllParentsClassList({ startElement: parentElm, endElement, list });

    return [...list, ...parentClassList];
  }

  return list;
};
