/* eslint-disable react/no-danger */
/* eslint-disable radix */

import { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  INCONELTABLE_HORIZONTAL_ALIGNMENT_LEFT,
  INCONELTABLE_HORIZONTAL_ALIGNMENT_CENTER,
  INCONELTABLE_HORIZONTAL_ALIGNMENT_RIGHT,
  INCONELTABLE_VERTICAL_ALIGNMENT_TOP,
  INCONELTABLE_VERTICAL_ALIGNMENT_CENTER,
  INCONELTABLE_VERTICAL_ALIGNMENT_BOTTOM,
  INCONELTABLE_MAIN_CLASSNAME,
  INCONELTABLE_ROW_ROWSPAN,
  SELECTION_ADD,
  SELECTION_REMOVE,
  INCONELTABLE_ROW_VALUES,
  INCONELTABLE_ROW_TEXTS
} from '../../constants';

import { isValidVariable, clearSystemConstantsFromRow, getValueFromSource, getConditionalString } from '../../utils';

import { InconelTablePropsContext } from '../../contexts/InconelTablePropsContext';
import './cellSection.scss';

/*
	==== columnProps ===
	cell: null
	cellClassName: null
	cellHorizontalAlign: "center"
	cellVerticalAlign: "center"
	customJsx: null
	dataKey: "netPrice"
	drag: true
	footer: null
	groupFlatList: ["6"]
	groupIdList: {1: Array(1)}
	headerClassName: null
	headerHorizontalAlign: "center"
	headerVerticalAlign: "center"
	hideMenuSelectable: true
	hideMenuVisible: true
	id: "6"
	level: 1
	locked: false
	maxWidth: null
	minWidth: null
	pinAccess: "both"
	title: "Net Fiyat"
	tooltip: null
	topElementId: null
	unitHeight: 2
*/

const CellSection = ({
  id = null,
  rowData = null,
  columnProps = null,
  rowNumber = null,
  width = null,
  height = null,
  rowNotEmpty = false,
  rowNotAccordion = true,
  showGroupBorder = false,
  maxWidthAllowed = false,
  conditionalStyles = null,
  disableSelectByAction = false,
  isFooter = false,
  canAccordionClickable = true
}) => {
  const { eventManagement, selection, accordion, cellPadding, updatedRowsObject, updateEffect, rowSpan, totalDataLength } =
    useContext(InconelTablePropsContext);

  const { minWidth, maxWidth, cell, footer, cellClassName, cellHorizontalAlign, cellVerticalAlign, renderAsHTML } = columnProps ?? {};

  const {
    onCellClick,
    onCellDoubleClick,
    onCellMouseDown,
    onCellMouseUp,
    onCellMouseEnter,
    onCellMouseLeave,
    onCellMouseMove,
    onCellContextMenu,
    colList: eventColList
  } = eventManagement;

  const { preventDeselect, selectedRows, setSelectedRows, enabled: selectionEnabled, colList: selectionColList } = selection ?? {};

  const { enabled: rowSpanEnabled, colList: rowSpanColList } = rowSpan ?? {};

  const notAllowedCssRulesForConditionalStyling = [
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'wordBreak',
    'whiteSpace'
  ];

  const { accordionState, handleAccordionClick, colList: accoridonColList } = accordion ?? {};

  const canAccordionClickableProp = !isFooter && canAccordionClickable && accoridonColList.includes(id);
  const accordionIsActive = !isFooter && rowNumber === accordionState.no && rowNotAccordion;

  const canRowSelect =
    !isFooter && rowNotEmpty && rowNotAccordion && selectionEnabled && selectionColList.includes(id) && !disableSelectByAction;

  const rowIsSelected = !isFooter && rowNotEmpty && rowNotAccordion && selectionEnabled ? selectedRows.includes(rowNumber) : false;

  const rowSpanIsActive = !isFooter && rowNotEmpty && rowSpanEnabled && cell === null && rowSpanColList.flat().includes(id);

  const getRowSpanClass = () => {
    if (!rowSpanIsActive) {
      return '';
    }

    const rowSpanVal = getValueFromSource({
      source: rowData,
      path: `${INCONELTABLE_ROW_ROWSPAN}.${id}`,
      defaultValue: null
    });

    if (rowSpanVal === null) {
      return '';
    }

    const isStart = parseInt(rowSpanVal) === 1;
    const isEnd = String(rowSpanVal).includes('end');
    const itemId = isNaN(rowSpanVal) ? rowSpanVal.split('-')[0] : rowSpanVal;

    // inconeltable-rowspan-item inconeltable-rowspan-item-1 inconeltable-rowspan-item-start, inconeltable-rowspan-item-between, inconeltable-rowspan-item-end
    const classRoot = `${INCONELTABLE_MAIN_CLASSNAME}-rowspan-item`;
    let resultClass = `${classRoot} ${classRoot}-${itemId}`;
    resultClass += isStart ? ` ${classRoot}-start` : '';
    resultClass += isEnd ? ` ${classRoot}-end` : '';
    resultClass += !isStart && !isEnd ? ` ${classRoot}-between` : '';

    return ` ${resultClass}`;
  };

  const rowSpanClass = getRowSpanClass();
  const cellContent = isValidVariable(rowData?.[INCONELTABLE_ROW_TEXTS]?.[id]) ? rowData[INCONELTABLE_ROW_TEXTS][id] : null;
  const cellValue = isValidVariable(rowData?.[INCONELTABLE_ROW_VALUES]?.[id]) ? rowData[INCONELTABLE_ROW_VALUES][id] : null;

  /*
  if (rowNotAccordion) {
    cellContent = isValidVariable(rowData?.[INCONELTABLE_ROW_TEXTS]?.[id]) ? rowData[INCONELTABLE_ROW_TEXTS][id] : null;
    cellValue = isValidVariable(rowData?.[INCONELTABLE_ROW_VALUES]?.[id]) ? rowData[INCONELTABLE_ROW_VALUES][id] : null;
  } else {
    cellContent = getValueFromSource({ source: rowData, path: dataKey, defaultValue: null });
    cellValue = cellContent;
  }
	*/

  const eventParams = {
    id,
    rowNumber,
    content: cellValue,
    rowData: clearSystemConstantsFromRow(rowData),
    isAccordionItem: !rowNotAccordion
  };

  // const cellContent = isValidVariable(rowData?.[INCONELTABLE_ROW_TEXTS]?.[id]) ? rowData[INCONELTABLE_ROW_TEXTS][id] : null;

  const rootClass = `${INCONELTABLE_MAIN_CLASSNAME}-cell-item`;
  let className = `${rootClass} ${rootClass}-${id}`;
  className += showGroupBorder ? ` ${INCONELTABLE_MAIN_CLASSNAME}-group-border` : '';
  className += isFooter ? ` ${INCONELTABLE_MAIN_CLASSNAME}-footer-item` : '';
  className +=
    isValidVariable(cellClassName) && String(cellClassName).trim() !== '' && rowNotEmpty
      ? ` ${getConditionalString({ value: cellClassName, rowValues: rowData?.[INCONELTABLE_ROW_VALUES], rowData })}`
      : '';
  className += rowSpanClass;
  className += !rowNotAccordion ? ` ${INCONELTABLE_MAIN_CLASSNAME}-accordion-item` : '';
  className += !rowNotEmpty ? ` ${INCONELTABLE_MAIN_CLASSNAME}-empty-cell` : '';
  className += disableSelectByAction ? ` ${INCONELTABLE_MAIN_CLASSNAME}-selection-disabled` : '';

  if (!isFooter && updateEffect) {
    const updatedColPool = Array.isArray(updatedRowsObject?.[rowNumber]) ? updatedRowsObject[rowNumber] : [];

    className += updatedColPool.includes(id) ? ` ${rootClass}-updated` : '';
  }

  const getFlexCssRules = (horizontal, vertical) => {
    // horizontal 	-> left, right, center
    // vertical 		-> top, center, bottom
    let horizontalRule = '';
    let verticalRule = '';

    // horizontal
    switch (horizontal) {
      case INCONELTABLE_HORIZONTAL_ALIGNMENT_LEFT:
        horizontalRule = 'flex-start';
        break;
      case INCONELTABLE_HORIZONTAL_ALIGNMENT_RIGHT:
        horizontalRule = 'flex-end';
        break;

      default:
        horizontalRule = INCONELTABLE_HORIZONTAL_ALIGNMENT_CENTER;
    }

    // vertical
    switch (vertical) {
      case INCONELTABLE_VERTICAL_ALIGNMENT_TOP:
        verticalRule = 'flex-start';
        break;
      case INCONELTABLE_VERTICAL_ALIGNMENT_BOTTOM:
        verticalRule = 'flex-end';
        break;

      default:
        verticalRule = INCONELTABLE_VERTICAL_ALIGNMENT_CENTER;
    }

    return { justifyContent: horizontalRule, alignItems: verticalRule };
  };

  let mainStyle = getFlexCssRules(cellHorizontalAlign, cellVerticalAlign);
  const textStyle = {};

  if (width !== null) {
    mainStyle.width = `${width}px`;
    mainStyle.flex = `1 0 ${width}px`;
  }

  if (height !== null) {
    mainStyle.height = `${height}px`;
  }

  if (minWidth !== null) {
    mainStyle.minWidth = `${minWidth}px`;
  }

  if (maxWidthAllowed && maxWidth !== null) {
    mainStyle.wordBreak = 'break-all';
    mainStyle.whiteSpace = 'break-spaces';
    textStyle.maxWidth = `${maxWidth - cellPadding.horizontal}px`;
  }

  if (cellHorizontalAlign === INCONELTABLE_HORIZONTAL_ALIGNMENT_LEFT) {
    textStyle.marginLeft = `${cellPadding.horizontal / 2}px`;
  } else if (cellHorizontalAlign === INCONELTABLE_HORIZONTAL_ALIGNMENT_RIGHT) {
    textStyle.marginRight = `${cellPadding.horizontal / 2}px`;
  }

  if (cellVerticalAlign === INCONELTABLE_VERTICAL_ALIGNMENT_TOP) {
    textStyle.marginTop = `${cellPadding.vertical / 2}px`;
  } else if (cellVerticalAlign === INCONELTABLE_VERTICAL_ALIGNMENT_BOTTOM) {
    textStyle.marginBottom = `${cellPadding.vertical / 2}px`;
  }

  const eventIsExist = (eventFunc) => !isFooter && rowNotEmpty && eventColList.includes(id) && typeof eventFunc === 'function';

  const handleCellClick = (e) => {
    if (canAccordionClickableProp) {
      if (accordionIsActive) {
        handleAccordionClick(null, null);
      } else {
        handleAccordionClick(rowNumber, rowData);
      }
    }

    if (canRowSelect && !(preventDeselect && rowIsSelected)) {
      setSelectedRows({
        index: rowNumber,
        type: rowIsSelected ? SELECTION_REMOVE : SELECTION_ADD,
        targetId: id,
        event: e
      });
    }

    if (eventIsExist(onCellClick)) {
      onCellClick({ ...eventParams, event: e });
    }
  };

  const renderCellContent = () => {
    if (isFooter) {
      return typeof footer === 'function' && totalDataLength > 0 ? footer(id) : null;
    }

    if (rowNotEmpty && typeof cell === 'function') {
      return cell({ ...eventParams });
    }

    if (rowSpanIsActive && rowSpanClass !== '' && !rowSpanClass.includes('-start')) {
      return <span />;
    }

    if (rowNotEmpty && renderAsHTML) {
      return <span dangerouslySetInnerHTML={{ __html: cellContent }} />;
    }

    return <span style={textStyle}>{cellContent}</span>;
  };

  // conditionalStyling
  if (rowNotEmpty && conditionalStyles !== null && isValidVariable(conditionalStyles?.[id])) {
    const { classList: cellClassList, style: cellStyle } = conditionalStyles[id];
    notAllowedCssRulesForConditionalStyling.forEach((cssRule) => {
      delete cellStyle?.[cssRule];
    });

    mainStyle = { ...mainStyle, ...cellStyle };
    className += cellClassList.length > 0 ? ` ${cellClassList.join(' ')}` : '';
  }

  return (
    <div
      role="button"
      className={className}
      style={mainStyle}
      onClick={eventIsExist(onCellClick) || canRowSelect || canAccordionClickableProp ? handleCellClick : null}
      onDoubleClick={eventIsExist(onCellDoubleClick) ? (e) => onCellDoubleClick({ ...eventParams, event: e }) : null}
      onMouseDown={eventIsExist(onCellMouseDown) ? (e) => onCellMouseDown({ ...eventParams, event: e }) : null}
      onMouseUp={eventIsExist(onCellMouseUp) ? (e) => onCellMouseUp({ ...eventParams, event: e }) : null}
      onMouseEnter={eventIsExist(onCellMouseEnter) ? (e) => onCellMouseEnter({ ...eventParams, event: e }) : null}
      onMouseLeave={eventIsExist(onCellMouseLeave) ? (e) => onCellMouseLeave({ ...eventParams, event: e }) : null}
      onMouseMove={eventIsExist(onCellMouseMove) ? (e) => onCellMouseMove({ ...eventParams, event: e }) : null}
      onContextMenu={eventIsExist(onCellContextMenu) ? (e) => onCellContextMenu({ ...eventParams, event: e }) : null}
    >
      {renderCellContent()}
    </div>
  );
};

CellSection.propTypes = {
  id: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  rowData: PropTypes.object,
  columnProps: PropTypes.object,
  rowNumber: PropTypes.number,
  rowNotEmpty: PropTypes.bool,
  rowNotAccordion: PropTypes.bool,
  showGroupBorder: PropTypes.bool,
  canAccordionClickable: PropTypes.bool,
  maxWidthAllowed: PropTypes.bool,
  conditionalStyles: PropTypes.object,
  disableSelectByAction: PropTypes.bool,
  isFooter: PropTypes.bool
};

export default CellSection;
