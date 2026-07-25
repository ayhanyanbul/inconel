/* eslint-disable no-continue */
/* eslint-disable no-extra-label */
import { DATA_SELECTION_TYPES as DST } from './constants';

export const isValidVariable = (val) => val !== null && val !== undefined;

export const mergeClassNames = (...args) => {
  const list = [];

  args.forEach((item) => {
    const itemString = item ? String(item).trim() : null;

    if (itemString) {
      list.push(itemString);
    }
  });

  const result = [...new Set(list)];

  return result.length > 0 ? result.join(' ') : null;
};

export const getGridColumnCss = ({ min = null, max = null } = {}) => {
  if (!isValidVariable(min) && !isValidVariable(max)) {
    return '1fr';
  }

  let minString = 'min-content';
  let maxString = '1fr';

  if (isValidVariable(min)) {
    minString = isNaN(min) ? String(min) : `${min}px`;
  }

  if (isValidVariable(max)) {
    maxString = isNaN(max) ? String(max) : `${max}px`;
  }

  return `minmax(${minString}, ${maxString})`;
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

export const debounce = (actionFunc = null, duration = null) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      actionFunc.apply(this, args);
    }, duration);
  };
};

export const getValidElementedArray = (val) => {
  if (!Array.isArray(val)) {
    return [];
  }

  return val.filter((item) => isValidVariable(item) && !isNaN(item));
};

export const getMinValue = (...args) => {
  const filteredList = getValidElementedArray(args);

  if (filteredList.length === 0) {
    return null;
  }

  return Math.min(...filteredList);
};

export const getMaxValue = (...args) => {
  const filteredList = getValidElementedArray(args);

  if (filteredList.length === 0) {
    return null;
  }

  return Math.max(...filteredList);
};

export const getIndexesFromTarget = (target) => {
  // val 	-> cell-4-1

  const idValue = target?.dataset?.cellId ?? null;
  const columnIdValue = target?.dataset?.columnId ?? null;

  const splitted = String(idValue).trim().split('-');
  const rowIndex = splitted?.[1] ?? null;
  const colIndex = splitted?.[2] ?? null;

  if (isValidVariable(rowIndex) && isValidVariable(colIndex)) {
    return { rowIndex: Number(rowIndex), colIndex: Number(colIndex), columnId: columnIdValue };
  }

  const parentNode = target?.parentElement ?? null;

  if (parentNode) {
    return getIndexesFromTarget(parentNode);
  }

  return null;
};

export const calculateCellProps = ({
  cellX = null,
  cellY = null,
  cursorX = null,
  cursorY = null,
  selected = { startX: null, startY: null, endX: null, endY: null },
  clipboard = { startX: null, startY: null, endX: null, endY: null }
}) => {
  let boxCssVariablesList = [];
  let clipboardCssVariablesList = null;
  let isSelected = false;
  let isExtended = false;
  let willDeleted = false;

  if (!isValidVariable(cellX) || !isValidVariable(cellY) || Object.values(selected).some((item) => !isValidVariable(item))) {
    return {
      boxCssVariablesList: ['border-right', 'border-bottom'],
      clipboardCssVariablesList,
      isSelected,
      isExtended,
      willDeleted,
      showDrag: false,
      isExtendedX: false,
      isExtendedY: false,
      reverseHorizontalDirection: false,
      reverseVerticalDirection: false
    };
  }

  const { startX, startY, endX, endY } = selected ?? {};
  const hasExtend = isValidVariable(cursorX) && isValidVariable(cursorY);
  const cursorXParam = hasExtend ? cursorX : endX;
  const cursorYParam = hasExtend ? cursorY : endY;

  const targetStartX = getMinValue(startX, cursorXParam);
  const targetEndX = cursorXParam < startX ? endX : cursorXParam; // getMaxValue(endX, cursorXParam);
  const targetStartY = getMinValue(startY, cursorYParam);
  const targetEndY = cursorYParam < startY ? endY : cursorYParam; // getMaxValue(endY, cursorYParam);

  const cellExistInlineRange = cellX >= startX && cellX <= endX && cellY >= startY && cellY <= endY;
  const deleteZoneX = cellExistInlineRange && cursorXParam < cellX && cursorXParam >= startX;
  const deleteZoneY = cellExistInlineRange && cursorYParam < cellY && cursorYParam >= startY;

  if (deleteZoneX || deleteZoneY) {
    willDeleted = true;
  }

  const widthRangeRule = cellX >= targetStartX && cellX <= targetEndX;
  const heightRangeRule = cellY >= targetStartY && cellY <= targetEndY;
  isSelected = widthRangeRule && heightRangeRule;

  // ======================= CLIPBOARD CALCULATIONS =======================

  if (clipboard) {
    const { startX: clipStartX, startY: clipStartY, endX: clipEndX, endY: clipEndY } = clipboard ?? {};

    const clipboardWidthRangeRule = cellX >= clipStartX && cellX <= clipEndX;
    const clipboardHeightRangeRule = cellY >= clipStartY && cellY <= clipEndY;
    const hasClipboard = clipboardWidthRangeRule && clipboardHeightRangeRule;

    if (hasClipboard) {
      clipboardCssVariablesList = [
        cellY === clipStartY && clipboardWidthRangeRule ? 'clipboard-top' : 'clipboard-none',
        cellY === clipEndY && clipboardWidthRangeRule ? 'clipboard-bottom' : 'clipboard-none',
        cellX === clipStartX && clipboardHeightRangeRule ? 'clipboard-left' : 'clipboard-none',
        cellX === clipEndX && clipboardHeightRangeRule ? 'clipboard-right' : 'clipboard-none'
      ];

      // console.log(cellX, cellY, clipboardCssVariablesList);
    }
  }

  // ======================= BORDER CALCULATIONS =======================
  if (cellY === targetStartY && widthRangeRule) {
    boxCssVariablesList.push('selected-border-top');
  }

  if (cellX === targetStartX && heightRangeRule) {
    boxCssVariablesList.push('selected-border-left');
  }

  if (cellX === targetEndX && heightRangeRule) {
    boxCssVariablesList.push('selected-border-right');
  } else if (!(cellX === targetStartX - 1 && heightRangeRule)) {
    boxCssVariablesList.push('border-right');
  }

  if (cellY === targetEndY && widthRangeRule) {
    boxCssVariablesList.push('selected-border-bottom');
  } else if (!(cellY === targetStartY - 1 && widthRangeRule)) {
    boxCssVariablesList.push('border-bottom');
  }

  if (boxCssVariablesList.length === 0) {
    boxCssVariablesList = ['border-right', 'border-bottom'];
  }

  // ======================= BORDER CALCULATIONS =======================

  if (!isSelected) {
    return {
      boxCssVariablesList,
      clipboardCssVariablesList,
      isSelected,
      isExtended,
      willDeleted,
      showDrag: false,
      isExtendedX: false,
      isExtendedY: false,
      reverseHorizontalDirection: false,
      reverseVerticalDirection: false
    };
  }

  const reverseHorizontalDirection = cursorXParam < startX;
  const reverseVerticalDirection = cursorYParam < startY;

  const isExtendedX = (!reverseHorizontalDirection && cellX > endX) || (reverseHorizontalDirection && cellX < startX);
  const isExtendedY = (!reverseVerticalDirection && cellY > endY) || (reverseVerticalDirection && cellY < startY);

  if ((isValidVariable(cursorX) && isExtendedX) || (isValidVariable(cursorY) && isExtendedY)) {
    isExtended = true;
  }

  return {
    boxCssVariablesList,
    clipboardCssVariablesList,
    isSelected,
    isExtended,
    isExtendedX,
    isExtendedY,
    willDeleted,
    reverseHorizontalDirection,
    reverseVerticalDirection,
    showDrag: cellX === targetEndX && cellY === targetEndY
  };
};

/*
const result = calculateCellProps({
  cellX: 2,
  cellY: 2,
  cursorX: 4,
  cursorY: 4,
  selected: { startX: 2, startY: 2, endX: 2, endY: 2 }
});

console.log('result', result);
*/

export const calculateData = ({
  data = null,
  columnKeyObject = null, // ['name', 'age', 'city']
  columns = null,
  selected = { startX: null, startY: null, endX: null, endY: null, cursorX: null, cursorY: null }, // { startX: 0, startY: 1,endX: 0, endY: 2, cursorX: 0, cursorY: 3 }
  setterAction = null
}) => {
  /*
  columnKeyObject = {
    1: { dataKey: 'contractName', isPassive: true },
    2: { dataKey: 'age', isPassive: false }
  }
	*/

  if (
    !Array.isArray(data) ||
    data.length === 0 ||
    !isValidVariable(columnKeyObject) ||
    Object.keys(columnKeyObject).length === 0 ||
    !selected ||
    Object?.values(selected).some((item) => !isValidVariable(item))
  ) {
    return null;
  }

  const { startX, startY, endX, endY, cursorX, cursorY } = selected ?? {};
  const result = {};

  const { type } = getSelectionType({ selected }) ?? {};
  const directionToTop = type === DST.EXTEND_TOP;
  const directionToBottom = type === DST.EXTEND_BOTTOM;
  const directionToRight = type === DST.EXTEND_RIGHT;
  const directionToLeft = type === DST.EXTEND_LEFT;
  const directionToBoth = type === DST.EXTEND_BOTH;
  const deleteHorizontal = type === DST.DELETE_HORIZONTAL;
  const deleteVertical = type === DST.DELETE_VERTICAL;
  let tempValue = null;

  if (directionToBoth) {
    const loopX = getMinValue(startX, cursorX);
    const loopY = getMinValue(startY, cursorY);
    const targetX = getMaxValue(endX, cursorX) + 1;
    const targetY = getMaxValue(endY, cursorY);

    const { dataKey: path } = columnKeyObject?.[columns[startX].id] ?? {};
    const cursorValue = getValueFromSource({ source: data?.[startY], path, defaultValue: null });

    // vertical loop
    for (let j = loopY; j <= targetY; j++) {
      let rowData = { ...data[j] };
      let i = loopX;

      // horizontal loop
      while (i !== targetX) {
        if (!(i === startX && j === startY)) {
          const { dataKey, isPassive } = columnKeyObject?.[columns[i].id] ?? {};

          if (!isPassive) {
            tempValue = setterAction?.({ currentValue: rowData[dataKey], targetValue: cursorValue, type });

            rowData = updateObject({
              data: rowData,
              path: dataKey,
              value: tempValue === undefined ? cursorValue : tempValue
            });
          }
        }

        i++;
      }

      result[j] = rowData;
    }
  } else if (directionToRight || directionToLeft) {
    const loopX = directionToRight ? endX : startX;
    const targetX = directionToRight ? cursorX + 1 : cursorX - 1;

    // vertical loop
    for (let j = startY; j <= endY; j++) {
      let rowData = { ...data[j] };
      let cursorValue = null;
      let cursorEmpty = true;

      let i = loopX;

      // horizontal loop
      while (i !== targetX) {
        const { dataKey, isPassive } = columnKeyObject?.[columns[i].id] ?? {};

        if (!isPassive) {
          if (cursorEmpty) {
            cursorEmpty = false;
            cursorValue = getValueFromSource({ source: rowData, path: dataKey, defaultValue: null });
          } else {
            tempValue = setterAction?.({ currentValue: rowData[dataKey], targetValue: cursorValue, type });

            if (tempValue === undefined) {
              rowData = updateObject({ data: rowData, path: dataKey, value: cursorValue });
            } else {
              rowData = updateObject({ data: rowData, path: dataKey, value: tempValue });
              cursorValue = tempValue;
            }
          }
        }

        i += directionToRight ? 1 : -1;
      }

      result[j] = rowData;
    }
  } else if (directionToBottom || directionToTop) {
    const loopY = directionToTop ? startY : endY;
    const targetY = directionToTop ? cursorY - 1 : cursorY + 1;

    let i = loopY;
    const cursorObj = {};

    // vertical loop
    while (i !== targetY) {
      let rowData = { ...data[i] };

      for (let j = startX; j <= endX; j++) {
        const { dataKey, isPassive } = columnKeyObject?.[columns[j].id] ?? {};

        if (!isPassive) {
          if (i === loopY) {
            cursorObj[dataKey] = getValueFromSource({ source: rowData, path: dataKey, defaultValue: null });
          } else {
            tempValue = setterAction?.({ currentValue: rowData[dataKey], targetValue: cursorObj[dataKey], type });

            if (tempValue === undefined) {
              rowData = updateObject({ data: rowData, path: dataKey, value: cursorObj[dataKey] });
            } else {
              rowData = updateObject({ data: rowData, path: dataKey, value: tempValue });
              cursorObj[dataKey] = tempValue;
            }
          }
        }
      }

      result[i] = rowData;
      i += directionToTop ? -1 : 1;
    }
  } else if (deleteHorizontal) {
    // vertical loop
    for (let j = startY; j <= endY; j++) {
      let rowData = { ...data[j] };
      let i = endX;

      // horizontal loop
      while (i !== cursorX) {
        const { dataKey, isPassive } = columnKeyObject?.[columns[i].id] ?? {};

        if (!isPassive) {
          tempValue = setterAction?.({ currentValue: rowData[dataKey], targetValue: null, type });
          rowData = updateObject({
            data: rowData,
            path: dataKey,
            value: tempValue === undefined ? null : tempValue
          });
        }

        i -= 1;
      }

      result[j] = rowData;
    }
  } else if (deleteVertical) {
    let i = endY;

    // vertical loop
    while (i !== cursorY) {
      let rowData = { ...data[i] };

      for (let j = startX; j <= endX; j++) {
        const { dataKey, isPassive } = columnKeyObject?.[columns[j].id] ?? {};

        if (!isPassive) {
          tempValue = setterAction?.({ currentValue: rowData[dataKey], targetValue: null, type });
          rowData = updateObject({
            data: rowData,
            path: dataKey,
            value: tempValue === undefined ? null : tempValue
          });
        }
      }

      result[i] = rowData;
      i -= 1;
    }
  }

  // console.log('=============================');
  // console.log('data', result);

  return Object.keys(result).length > 0 ? result : null;
};

export const cursorDistanceCalculator = ({ event = null, parentElement = null } = {}) => {
  const { clientX, clientY } = event ?? {};
  const { left, top } = parentElement?.getBoundingClientRect() ?? {};

  if (!isValidVariable(clientX) || !isValidVariable(clientY) || !isValidVariable(left) || !isValidVariable(top)) {
    return null;
  }

  return {
    x: Math.floor(clientX - left),
    y: Math.floor(clientY - top)
  };
};

export const getSelectionType = ({
  selected = { startX: null, startY: null, endX: null, endY: null, cursorX: null, cursorY: null } // { startX: 0, startY: 1,endX: 0, endY: 2, cursorX: 0, cursorY: 3 }
} = {}) => {
  if (Object?.values(selected).some((item) => !isValidVariable(item))) {
    return null;
  }

  const { startX, startY, endX, endY, cursorX, cursorY } = selected ?? {};

  let isHorizontal = false;
  let isVertical = false;
  const onStartPoint = cursorX === endX && cursorY === endY;
  const singleCellSelected =
    isValidVariable(startX) &&
    isValidVariable(startY) &&
    isValidVariable(endX) &&
    isValidVariable(endY) &&
    startX === endX &&
    startY === endY;

  if (onStartPoint) {
    return { type: DST.NONE, isHorizontal, isVertical };
  }

  if (singleCellSelected) {
    return { type: DST.EXTEND_BOTH, isHorizontal, isVertical };
  }

  const cellExistInlineRange = cursorX >= startX && cursorX <= endX && cursorY >= startY && cursorY <= endY;

  if (cellExistInlineRange) {
    // içten silme
    isVertical = cursorY !== endY;

    return { type: isVertical ? DST.DELETE_VERTICAL : DST.DELETE_HORIZONTAL, isHorizontal, isVertical };
  }

  if (!cellExistInlineRange && cursorY >= startY && cursorY < endY) {
    // dikey silme - fare seçmin dışında
    return { type: DST.DELETE_VERTICAL, isHorizontal: false, isVertical: true };
  }

  let type = null;
  const distanceX = Math.abs(endX - cursorX);
  const distanceY = Math.abs(endY - cursorY);
  isHorizontal = distanceY < distanceX;

  if (isHorizontal) {
    type = cursorX > endX ? DST.EXTEND_RIGHT : DST.EXTEND_LEFT;
  } else {
    type = cursorY > endY ? DST.EXTEND_BOTTOM : DST.EXTEND_TOP;
  }

  return { type, isHorizontal, isVertical };
};

const dataSetter = (data, path, value) => {
  const [current, ...rest] = path;

  if (rest.length > 0) {
    if (!data[current]) {
      const isNumber = `${+rest[0]}` === rest[0];
      data[current] = isNumber ? [] : {};
    }

    if (typeof data[current] !== 'object') {
      const isNumber = `${+rest[0]}` === rest[0];
      data[current] = dataSetter(isNumber ? [] : {}, rest, value);
    } else {
      data[current] = dataSetter(data[current], rest, value);
    }
  } else {
    data[current] = value;
  }

  return data;
};

export const updateObject = ({ data = null, path = null, value = null } = {}) => {
  if (!isValidVariable(path)) {
    return data;
  }

  let pathArr = path;

  if (typeof path === 'string') {
    pathArr = path.replace('[', '.').replace(']', '').split('.');
  }

  const result = structuredClone(data);
  dataSetter(result, pathArr, value);

  return result;
};

export const getDeletedData = ({
  data = null,
  columnKeyObject = null, // ['name', 'age', 'city']
  columns = null,
  selected = { startX: null, startY: null, endX: null, endY: null } // { startX: 0, startY: 1,endX: 0, endY: 2 }
}) => {
  if (
    !Array.isArray(data) ||
    data.length === 0 ||
    !isValidVariable(columnKeyObject) ||
    Object.keys(columnKeyObject).length === 0 ||
    !selected ||
    Object?.values?.(selected).some((item) => !isValidVariable(item))
  ) {
    return null;
  }

  const { startX, startY, endX, endY } = selected ?? {};
  const sourceData = structuredClone(data);

  for (let i = startY; i <= endY; i++) {
    let rowData = sourceData?.[i];

    for (let j = startX; j <= endX; j++) {
      const { id, dataKey } = columns?.[j] ?? {};
      const isPassive = columnKeyObject?.[id]?.isPassive || false;

      if (!isPassive) {
        rowData = updateObject({ data: rowData, path: dataKey, value: null });
      }
    }

    sourceData[i] = rowData;
  }

  return sourceData;
};

export const getCopyPasteData = ({
  data = null,
  columnKeyObject = null, // ['name', 'age', 'city']
  columns = null,
  selected = { startX: null, startY: null, endX: null, endY: null }, // { startX: 0, startY: 1,endX: 0, endY: 2 }
  target = { x: null, y: null },
  isCut = false,
  maxSelectableRowIndex = 0
}) => {
  /*
  columnKeyObject = {
    1: { dataKey: 'contractName', isPassive: true },
    2: { dataKey: 'age', isPassive: false }
  }
	*/

  if (
    !Array.isArray(data) ||
    data.length === 0 ||
    !isValidVariable(columnKeyObject) ||
    Object.keys(columnKeyObject).length === 0 ||
    !selected ||
    !target ||
    Object?.values?.(selected).some((item) => !isValidVariable(item)) ||
    Object?.values?.(target).some((item) => !isValidVariable(item))
  ) {
    return null;
  }

  const { startX, startY, endX, endY } = selected ?? {};
  const { x, y } = target ?? {};
  const sourceData = structuredClone(data);
  const willCopiedData = [];
  let maxX = null;
  let maxY = null;

  // kopyalanacak veriler hazırlanıyor --------------------------------------
  for (let i = startY; i <= endY; i++) {
    const rowData = sourceData?.[i];
    let manipulatedRowDataForCutting = isCut ? structuredClone(rowData) : [];
    const tempData = [];

    for (let j = startX; j <= endX; j++) {
      const dataKey = columns?.[j]?.dataKey ?? null;
      const columnValue = getValueFromSource({ source: rowData, path: dataKey, defaultValue: null });
      tempData.push(columnValue);

      if (isCut) {
        manipulatedRowDataForCutting = updateObject({
          data: manipulatedRowDataForCutting,
          path: dataKey,
          value: null
        });
      }
    }

    if (isCut) {
      sourceData[i] = manipulatedRowDataForCutting;
    }

    willCopiedData.push(tempData);
  }
  // ---------------------------------------------------------------------

  const dataXLength = willCopiedData?.[0]?.length || 0;
  const dataYLength = willCopiedData?.length || 0;
  let rowCursor = 0;

  rowLoop: for (let i = y; i < y + dataYLength; i++) {
    let colCursor = -1;
    let rowData = sourceData?.[i] ?? null;

    if (!rowData || i > maxSelectableRowIndex - 1) {
      maxY = i - 1;
      break rowLoop;
    }

    columnLoop: for (let j = x; j < x + dataXLength; j++) {
      if (j >= columns.length) {
        maxX = j - 1;
        break columnLoop;
      }

      colCursor++;
      const { id, dataKey } = columns?.[j] ?? {};
      const isPassive = columnKeyObject?.[id]?.isPassive || false;

      if (isPassive) {
        continue columnLoop;
      }

      rowData = updateObject({
        data: rowData,
        path: dataKey,
        value: willCopiedData?.[rowCursor]?.[colCursor] ?? null
      });
    }

    sourceData[i] = rowData;
    rowCursor++;
  }

  // console.log('result', sourceData, maxX, maxY);

  return {
    calculatedData: sourceData,
    calculatedSelection: {
      startX: x,
      startY: y,
      endX: maxX ?? x + dataXLength - 1,
      endY: maxY ?? y + dataYLength - 1
    }
  };
};

/*

const tempData = [
  { no: 0, contractName: 'ABCD-0', detail: { age: 43 } },
  { no: 1, contractName: 'ABCD-1', detail: { age: 37 } },
  { no: 2, contractName: 'ABCD-2', detail: { age: 36 } },
  { no: 3, contractName: 'ABCD-3', detail: { age: 38 } },
  { no: 4, contractName: 'ABCD-4', detail: { age: 38 } }
];

const colKeys = {
  1: { dataKey: 'contractName', isPassive: false },
  2: { dataKey: 'detail.age', isPassive: false },
  '0a': { dataKey: 'no', isPassive: false }
};

const columnsList = [
  { id: '0a', title: 'Kontrat ID', dataKey: 'no', maxWidth: 150, cellClassName: 'cell-bg' },
  { id: 1, title: 'Kontrat', dataKey: 'contractName', maxWidth: 150, cellClassName: 'cell-bg' },
  { id: 2, title: 'No', dataKey: 'detail.age', maxWidth: 150, cellClassName: 'cell-bg' }
];


const newData = getCopyPasteData({
  columnKeyObject: colKeys,
  columns: columnsList,
  data: tempData,
  isCut: true,
  selected: { startX: 0, startY: 0, endX: 1, endY: 1 },
  target: { x: 0, y: 4 }
});
*/
