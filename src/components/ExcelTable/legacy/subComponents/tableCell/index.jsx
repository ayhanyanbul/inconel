import { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { getValueFromSource, isValidVariable, mergeClassNames } from '../../utils';
import './_index.scss';

const TableCell = ({
  colItem = null,
  dataItem = null,
  rowIndex = null,
  colIndex = null,
  rowHeight = null,
  boxCssVariablesList = null,
  clipboardCssVariablesList = null,
  clipboardIsCut = false,
  copyOptions = null,
  dragAction = null,
  dragActive = false,
  bodyCellPositions = null
}) => {
  const containerRef = useRef(null);

  const { id, dataKey, cell, cellClassName, pinLeft, pinRight } = colItem ?? {};
  const { copyIsPassive, isExtended, isSelected, willDeleted, showDrag } = copyOptions ?? {};

  const cellUniqueId = `cell-${rowIndex}-${colIndex}`;
  let pinClass = null;

  if (pinLeft) {
    pinClass = 'pin-left';
  } else if (pinRight) {
    pinClass = 'pin-right';
  }

  const mainCls = mergeClassNames(
    'inconel-excel-table-table-cell',
    cellClassName,
    pinClass,
    isSelected ? 'cell-selected' : '',
    isExtended ? 'cell-will-extend' : '',
    willDeleted ? 'cell-will-deleted' : '',
    copyIsPassive && dragActive ? 'cell-copy-passive' : '',
    showDrag ? 'cell-is-extender' : '',
    clipboardCssVariablesList ? 'has-clipboard' : ''
  );

  // console.log(cellUniqueId, isExtended);

  const styleObject = useMemo(() => {
    const result = {};

    if (isValidVariable(rowHeight)) {
      result.height = `${rowHeight}px`;
    }

    if (Array.isArray(boxCssVariablesList)) {
      const cssList = [];

      boxCssVariablesList.forEach((item) => {
        if (item) {
          cssList.push(`var(--${item})`);
        }
      });

      if (cssList.length > 0) {
        result.boxShadow = cssList.join(', ');
      }
    }

    return result;
  }, [rowHeight, boxCssVariablesList]);

  const contentValue = getValueFromSource({ source: dataItem, path: dataKey, defaultValue: null });
  let renderValue = contentValue;

  if (typeof cell === 'function') {
    renderValue = cell({ rowData: dataItem, content: contentValue, rowIndex, dataKey });
  }

  const handleDrag = (e) => {
    e.stopPropagation();
    dragAction?.();
  };

  useEffect(() => {
    let result = 'none';

    if (Array.isArray(clipboardCssVariablesList)) {
      const cssList = [];
      const cssPrefix = clipboardIsCut ? 'cut' : 'copy';

      clipboardCssVariablesList.forEach((item) => {
        if (item) {
          const isNone = String(item).includes('none');
          const prefix = isNone ? '' : `-${cssPrefix}`;

          cssList.push(`var(--${item}${prefix})`);
        }
      });

      if (cssList.length > 0) {
        result = cssList.join(', ');
      }
    }

    containerRef.current.style.setProperty('--clipboard-value', result);
  }, [clipboardCssVariablesList, clipboardIsCut]);

  return (
    <div
      key={cellUniqueId}
      ref={containerRef}
      className={mainCls}
      style={styleObject}
      data-cell-id={cellUniqueId}
      data-column-id={id}
      // data-value={contentValue}
    >
      <div
        role="button"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const { left, right, top, bottom, width, height } = rect || {};
          bodyCellPositions({ left, right, top, bottom, width, height, type: 'body' });
        }}
        className="cell-content"
      >
        {renderValue}
      </div>
      {showDrag && !dragActive ? <div role="button" className="cell-drag-Button" onMouseDown={handleDrag} /> : null}
    </div>
  );
};

TableCell.propTypes = {
  colItem: PropTypes.shape({}),
  dataItem: PropTypes.shape({}),
  rowIndex: PropTypes.number,
  colIndex: PropTypes.number,
  rowHeight: PropTypes.number,
  boxCssVariablesList: PropTypes.array,
  clipboardCssVariablesList: PropTypes.array,
  clipboardIsCut: PropTypes.bool,
  copyOptions: PropTypes.shape({
    copyIsPassive: PropTypes.bool,
    isSelected: PropTypes.bool,
    isExtended: PropTypes.bool,
    isExtendedX: PropTypes.bool,
    isExtendedY: PropTypes.bool,
    willDeleted: PropTypes.bool,
    showDrag: PropTypes.bool
  }),
  dragAction: PropTypes.func,
  dragActive: PropTypes.bool,
  bodyCellPositions: PropTypes.func
};

export default TableCell;
