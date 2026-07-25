/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useRef, useMemo, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  calculateCellProps,
  calculateData,
  cursorDistanceCalculator,
  debounce,
  getCopyPasteData,
  getDeletedData,
  getIndexesFromTarget,
  getMaxValue,
  getMinValue,
  getSelectionType,
  getValueFromSource,
  isValidVariable,
  mergeClassNames
} from '../utils';
import TableCell from './tableCell';
import PreviewTooltip from './previewTooltip/index';
import { CLIPBOARD_MODES, DATA_SELECTION_TYPES as DST } from '../constants';

const TableBody = forwardRef(
  ({ dataArray = null, columns = null, rowHeight = null, copy = null, dragStatus = null, bodyCellPositions = null }, ref) => {
    const {
      enabled: copyEnabled,
      setData,
      copyAction,
      onPasteAction,
      onKeyboardAction,
      disabledRowCountFromTop,
      disabledRowCountFromBottom,
      passiveColumns,
      showPreviewLabel
    } = copy ?? {};

    const [selectionMode, setSelectionMode] = useState(false);
    const [dragMode, setDragMode] = useState(false);
    const [clipboard, setClipboard] = useState({ mode: null, hasSelection: false, data: null });
    const [, setRenderCount] = useState(0);

    const selectionRef = useRef({
      startX: null,
      startY: null,
      endX: null,
      endY: null,
      cursorX: null,
      cursorY: null
    });

    const holderRef = useRef(null);

    const cursorMovementRef = useRef({ active: false, x: null, y: null });
    const dragDirectionRef = useRef(null);
    const dragDropperRef = useRef(false);
    const calculatedDataForUpdatingRef = useRef(null); // { isDeleting: null, horizontal: 1, vertical: 0 }
    const cursorLabelRef = useRef({ text: null, style: null });
    const shiftKeyPressedRef = useRef(false);

    const dataLength = dataArray?.length || 0;

    const maxSelectableRowIndex = useMemo(() => {
      if (!copyEnabled || !disabledRowCountFromBottom) {
        return dataLength;
      }

      if (disabledRowCountFromBottom > dataLength) {
        return 0;
      }

      return dataLength - disabledRowCountFromBottom;
    }, [copyEnabled, dataLength, disabledRowCountFromBottom]);

    const previewLabelExist =
      dragMode && copyEnabled && showPreviewLabel && dragDirectionRef.current && dragDirectionRef.current !== DST.NONE;

    const mainCls = mergeClassNames(
      'body-holder',
      dragMode ? 'drag-active' : '',
      clipboard?.mode === CLIPBOARD_MODES.CUT ? 'cut-mode' : '',
      clipboard?.mode === CLIPBOARD_MODES.COPY ? 'copy-mode' : ''
    );

    const renderAgain = () => setRenderCount((currentValue) => currentValue + 1);

    const columnKeyObject = useMemo(() => {
      if (!Array.isArray(columns) || columns.length === 0) {
        return [];
      }

      const result = {};

      columns.forEach(({ id, dataKey }) => {
        const isPassive = passiveColumns.find((passiveItem) => String(passiveItem) === String(id));

        result[id] = { dataKey, isPassive: !!isPassive };
      });

      return result;
    }, [columns, passiveColumns]);

    const resetSelectionAndClipboard = () => {
      selectionRef.current = {
        ...selectionRef.current,
        startX: null,
        startY: null,
        endX: null,
        endY: null,
        cursorX: null,
        cursorY: null
      };

      setClipboard({ mode: null, hasSelection: false, data: null });
    };

    const getSelectionProps = (posX = null, posY = null) => {
      if (!copyEnabled) {
        return {
          boxCssVariablesList: ['border-right', 'border-bottom'],
          copyOptions: null
        };
      }

      const columnId = columns?.[posX]?.id;
      const { startX, startY, endX, endY, cursorX, cursorY } = selectionRef.current ?? {};

      const {
        boxCssVariablesList,
        clipboardCssVariablesList,
        isExtended,
        isExtendedX,
        isExtendedY,
        isSelected,
        showDrag,
        willDeleted,
        reverseHorizontalDirection,
        reverseVerticalDirection
      } = calculateCellProps({
        cellX: posX,
        cellY: posY,
        cursorX: cursorX ?? null,
        cursorY: cursorY ?? null,
        clipboard: clipboard?.data,
        selected: {
          startX: getMinValue(startX, endX),
          startY: getMinValue(startY, endY),
          endX: getMaxValue(startX, endX),
          endY: getMaxValue(startY, endY)
        }
      });

      return {
        boxCssVariablesList,
        clipboardCssVariablesList,
        copyOptions: {
          copyIsPassive: columnKeyObject?.[columnId]?.isPassive,
          valueUpdated: isExtended || willDeleted,
          isExtended,
          isExtendedX,
          isExtendedY,
          isSelected,
          reverseHorizontalDirection,
          reverseVerticalDirection,
          showDrag,
          willDeleted
        }
      };
    };

    const handleMouseMove = debounce((e) => {
      e.stopPropagation();

      const { colIndex, rowIndex, columnId } = getIndexesFromTarget(e?.target) ?? {};

      if (
        !isValidVariable(rowIndex) ||
        !isValidVariable(colIndex) ||
        disabledRowCountFromTop > rowIndex ||
        rowIndex >= maxSelectableRowIndex
      ) {
        return false;
      }

      const { x, y } = cursorDistanceCalculator({ event: e, parentElement: ref.current }) ?? {};
      const { active, x: firstX, y: firstY } = cursorMovementRef.current ?? {};

      if (Math.abs(firstX - x) > 20 || Math.abs(firstY - y) > 20) {
        cursorMovementRef.current = { ...cursorMovementRef.current, active: true };
      }

      if (!active) {
        return false;
      }

      document.activeElement.blur(); // sürükleme işlemi başladığı için -> focusu sil
      window.getSelection().removeAllRanges(); // sürükleme işlemi başladığı için -> fareyle seçilen bir şey varsa, seçimi kaldır
      const { endX, endY } = selectionRef.current ?? {};

      window.requestAnimationFrame(() => {
        if (dragMode) {
          if (showPreviewLabel && isValidVariable(x) && isValidVariable(y)) {
            const keyName = columnKeyObject?.[columnId]?.dataKey ?? null;

            cursorLabelRef.current = {
              text: getValueFromSource({ source: calculatedDataForUpdatingRef.current?.[rowIndex], path: keyName, defaultValue: null }),
              style: { transform: `translate(${x - 10}px, ${y + 10}px)` }
            };
          }

          const selectionObject = { ...selectionRef.current, cursorX: colIndex, cursorY: rowIndex };
          const { type, isHorizontal, isVertical } = getSelectionType({ selected: selectionObject });

          if (type === DST.EXTEND_BOTH) {
            selectionRef.current = { ...selectionRef.current, cursorX: colIndex, cursorY: rowIndex };
          } else if (type === DST.DELETE_VERTICAL || type === DST.DELETE_HORIZONTAL) {
            selectionRef.current = {
              ...selectionRef.current,
              cursorX: !isVertical ? colIndex : endX,
              cursorY: !isVertical ? endY : rowIndex
            };
          } else {
            selectionRef.current = {
              ...selectionRef.current,
              cursorX: isHorizontal ? colIndex : endX,
              cursorY: isHorizontal ? endY : rowIndex
            };
          }

          dragDirectionRef.current = type;
          calculatedDataForUpdatingRef.current = calculateData({
            selected: selectionRef.current,
            data: dataArray,
            setterAction: copyAction,
            columnKeyObject,
            columns
          });

          // console.log(calculatedDataForUpdatingRef.current);
        } else {
          // selection mode
          selectionRef.current = { ...selectionRef.current, endX: colIndex, endY: rowIndex };
        }

        renderAgain();
      });

      return true;
    }, 1);

    const handleMouseUp = (e) => {
      e.stopPropagation();

      cursorMovementRef.current = { active: false, x: null, y: null };
      const { startX, startY, endX, endY, cursorX, cursorY } = selectionRef.current ?? {};

      if (dragDropperRef.current) {
        const dragDirection = dragDirectionRef.current;
        const directionIsDelete = dragDirection === DST.DELETE_HORIZONTAL || dragDirection === DST.DELETE_VERTICAL;

        setTimeout(() => {
          selectionRef.current = {
            ...selectionRef.current,
            startX: getMinValue(startX, cursorX),
            startY: getMinValue(startY, cursorY),
            endX: directionIsDelete ? cursorX : getMaxValue(endX, cursorX),
            endY: directionIsDelete ? cursorY : getMaxValue(endY, cursorY),
            cursorX: null,
            cursorY: null
          };

          renderAgain();
        }, 100);

        if (calculatedDataForUpdatingRef.current) {
          const copyData = calculatedDataForUpdatingRef.current;
          const indexList = Object.keys(copyData);

          setData((currentValue) => {
            let currentIndex = null;
            const newData = [...currentValue];

            for (let i = 0; i < indexList.length; i++) {
              currentIndex = indexList[i];
              newData[currentIndex] = copyData[currentIndex];
            }

            return newData;
          });
        }

        setClipboard({ mode: null, hasSelection: true, data: null });
        dragDirectionRef.current = null;
        document.activeElement?.blur?.();
        setDragMode(false);
      } else {
        const selectedProps = {
          startX: getMinValue(startX, endX),
          startY: getMinValue(startY, endY),
          endX: getMaxValue(startX, endX),
          endY: getMaxValue(startY, endY)
        };

        selectionRef.current = { ...selectionRef.current, ...selectedProps };

        setClipboard((currentValue) => ({ ...currentValue, hasSelection: true }));
        setSelectionMode(false);
      }

      dragStatus?.(dragDropperRef.current ? 'end' : 'start');
      dragDropperRef.current = false;
    };

    const handleMouseDown = (e) => {
      // e.stopPropagation();

      const { rowIndex, colIndex, columnId } = getIndexesFromTarget(e?.target) ?? {};

      if (
        !isValidVariable(rowIndex) ||
        !isValidVariable(colIndex) ||
        disabledRowCountFromTop > rowIndex ||
        rowIndex >= maxSelectableRowIndex
      ) {
        return false;
      }

      if (columnKeyObject?.[columnId].isPassive) {
        return false;
      }

      const { x, y } = cursorDistanceCalculator({ event: e, parentElement: ref.current }) ?? {};
      cursorMovementRef.current = { ...cursorMovementRef.current, x, y };
      const { startX, startY } = selectionRef.current ?? {};

      // shift ile seçim yapıldıysa
      if (shiftKeyPressedRef.current && isValidVariable(startX) && isValidVariable(startY)) {
        const resultObj = {};

        if (colIndex < startX) {
          resultObj.startX = getMinValue(startX, colIndex);
        } else {
          resultObj.endX = colIndex;
        }

        if (rowIndex < startY) {
          resultObj.startY = getMinValue(startY, rowIndex);
        } else {
          resultObj.endY = rowIndex;
        }

        selectionRef.current = { ...selectionRef.current, ...resultObj };

        window.getSelection().removeAllRanges();
      } else {
        selectionRef.current = {
          ...selectionRef.current,
          startX: colIndex,
          startY: rowIndex,
          endX: colIndex,
          endY: rowIndex
        };
      }

      setSelectionMode(true);

      window.addEventListener('mouseup', handleMouseUp, { once: true });

      renderAgain();
      return true;
    };

    const handleDragStart = () => {
      setDragMode(true);

      dragDropperRef.current = true;
      window.addEventListener('mouseup', handleMouseUp, { once: true });
    };

    const bodyJsx = useMemo(() => {
      if (!Array.isArray(columns) || columns.length === 0) {
        return null;
      }

      const result = dataArray.map((dataItem, rowIndex) => {
        const rowIsPassive = copyEnabled && rowIndex < disabledRowCountFromTop && rowIndex >= maxSelectableRowIndex;

        let rowClass = `table-row table-row-${rowIndex} table-row-${rowIndex % 2 === 0 ? 'even' : 'odd'}`;
        rowClass = mergeClassNames(rowClass, rowIsPassive ? 'table-row-passive' : '');

        return (
          <div key={`row-${rowIndex}`} className={rowClass}>
            {columns.map((colItem, colIndex) => {
              const { boxCssVariablesList, clipboardCssVariablesList, copyOptions } = getSelectionProps(colIndex, rowIndex);

              return (
                <TableCell
                  key={`item-${rowIndex}-${colIndex}`}
                  colItem={colItem}
                  dataItem={dataItem}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  rowHeight={rowHeight}
                  boxCssVariablesList={boxCssVariablesList}
                  clipboardCssVariablesList={clipboardCssVariablesList}
                  clipboardIsCut={clipboard?.mode === CLIPBOARD_MODES.CUT}
                  copyOptions={copyOptions}
                  dragAction={handleDragStart}
                  dragActive={dragMode}
                  bodyCellPositions={(e) => {
                    bodyCellPositions(e);
                  }}
                />
              );
            })}
          </div>
        );
      });

      return result;
    }, [columns, dataArray, rowHeight, copyEnabled, disabledRowCountFromTop, maxSelectableRowIndex, getSelectionProps, dragMode, setData]);

    useEffect(() => {
      const clickOutsideListener = (e) => {
        if (!holderRef.current || holderRef.current.contains(e.target)) {
          return false;
        }

        if (Object.values(selectionRef.current).some((item) => isValidVariable(item))) {
          resetSelectionAndClipboard();
          renderAgain();
        }

        return true;
      };

      const keyDownListener = (e) => {
        const { shiftKey } = e ?? {};

        if (shiftKey) {
          shiftKeyPressedRef.current = true;
        }
      };

      const keyUpListener = () => {
        shiftKeyPressedRef.current = false;
      };

      if (copyEnabled) {
        document.addEventListener('mousedown', clickOutsideListener);
        document.addEventListener('keydown', keyDownListener);
        document.addEventListener('keyup', keyUpListener);
      }

      return () => {
        shiftKeyPressedRef.current = false;
        selectionRef.current = {
          ...selectionRef.current,
          startX: null,
          startY: null,
          endX: null,
          endY: null,
          cursorX: null,
          cursorY: null
        };
        document.removeEventListener('mousedown', clickOutsideListener);
        document.removeEventListener('keydown', keyDownListener);
        document.removeEventListener('keyup', keyUpListener);
      };
    }, [copyEnabled]);

    useEffect(() => {
      const { data, hasSelection, mode } = clipboard ?? {};
      const copyAllowed = !!(copyEnabled && hasSelection);

      const handleCopy = (e) => {
        const { ctrlKey, metaKey, key } = e ?? {};
        const functionalKeyIsPressed = !!(ctrlKey || metaKey);

        const hasCopy = functionalKeyIsPressed && (key === 'c' || key === 'C');
        const hasCut = functionalKeyIsPressed && (key === 'x' || key === 'X');

        if (hasCopy || hasCut) {
          const { startX, startY, endX, endY } = selectionRef.current ?? {};
          const selectedProps = {
            startX: getMinValue(startX, endX),
            startY: getMinValue(startY, endY),
            endX: getMaxValue(startX, endX),
            endY: getMaxValue(startY, endY)
          };

          setClipboard((currentValue) => ({
            ...currentValue,
            data: selectedProps,
            mode: hasCopy ? CLIPBOARD_MODES.COPY : CLIPBOARD_MODES.CUT
          }));
        } else if (key === 'Escape') {
          resetSelectionAndClipboard();
        } else if (key === 'Delete' || key === 'Backspace') {
          // focus body'de ise
          if (document.activeElement === document.body) {
            const { startX, startY, endX, endY } = selectionRef.current ?? {};
            const calculatedData = getDeletedData({
              data: dataArray,
              selected: { startX, startY, endX, endY },
              columnKeyObject,
              columns
            });

            if (calculatedData) {
              setData(calculatedData);
              onKeyboardAction?.({ previousData: dataArray, currentData: calculatedData });
            }
          }
        } else if (mode && functionalKeyIsPressed && (key === 'v' || key === 'V')) {
          // YAPIŞTIR --------------------------------------------------
          const isCut = mode === CLIPBOARD_MODES.CUT;
          const { startX, startY } = selectionRef.current ?? {};

          const { calculatedData, calculatedSelection } = getCopyPasteData({
            columnKeyObject,
            columns,
            data: dataArray,
            isCut,
            selected: data,
            target: { x: startX, y: startY },
            maxSelectableRowIndex
          });

          if (calculatedData) {
            onPasteAction?.({ previousData: dataArray, currentData: calculatedData });
            setData(calculatedData);
          }

          if (calculatedSelection) {
            selectionRef.current = { ...calculatedSelection, cursorX: null, cursorY: null };

            if (isCut) {
              setClipboard({ mode: null, hasSelection: true, data: null });
            }
          }

          // console.log('paste', mode, data, { startX, startY });
        }
      };

      if (copyAllowed) {
        document.addEventListener('keydown', handleCopy);
      }

      return () => {
        if (copyAllowed) {
          document.removeEventListener('keydown', handleCopy);
        }
      };
    }, [copyEnabled, clipboard]);

    return (
      <>
        <div
          ref={holderRef}
          className={mainCls}
          onMouseDown={copyEnabled ? handleMouseDown : null}
          onMouseMove={copyEnabled && (selectionMode || dragMode) ? handleMouseMove : null}
        >
          {bodyJsx}
        </div>
        {previewLabelExist && (
          <PreviewTooltip ref={ref} text={cursorLabelRef?.current?.text} styleObject={cursorLabelRef?.current?.style} />
        )}
      </>
    );
  }
);

TableBody.propTypes = {
  dataArray: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.object),
  rowHeight: PropTypes.number,
  copy: PropTypes.shape({}),
  dragStatus: PropTypes.func,
  bodyCellPositions: PropTypes.func
};

export default TableBody;
