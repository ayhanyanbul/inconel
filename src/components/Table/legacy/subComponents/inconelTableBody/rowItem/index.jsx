/* eslint-disable jsx-a11y/label-has-associated-control */
import { useContext, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import MinusIcon from 'assets/icons/minus.svg';
import PlusIcon from 'assets/icons/plus.svg';
import InconelSvg from 'components/Svg';

import {
  INCONELTABLE_MAIN_CLASSNAME,
  INCONELTABLE_ROW_ACCORDION_CUSTOM,
  INCONELTABLE_ROW_ACCORDION_INDEX,
  INCONELTABLE_ROW_INDEX,
  INCONELTABLE_ROW_LOADMORE,
  INCONELTABLE_ROW_VALUES,
  SELECTION_ADD,
  SELECTION_REMOVE,
} from '../../constants';
import { InconelTablePropsContext } from '../../contexts/InconelTablePropsContext';
import { checkConditionalStyles, getValueFromSource, isValidVariable, itemIsGroup } from '../../utils';
import CellSection from '../cellSection';

import './rowItem.scss';

const RowItem = ({
  rowNumber,
  rowData,
  styleObject,
  tableSectionSizes,
  columnWidthList,
  rowHeight,
  elementPropsObject,
  leftColList,
  centerColList,
  rightColList,
  applyHorizontalScrollValues,
  groupBordersObject,
  customAccordionTriggerData,
  allColumnsHided,
  maxWidthAllowed,
}) => {
  const { columns, hoverEffect, systemColumnsWidth, selection, accordion, getLanguageText, scrollable, conditionalStyling } =
    useContext(InconelTablePropsContext);

  const rowNotEmpty = isValidVariable(rowData) && isValidVariable(rowData?.[INCONELTABLE_ROW_VALUES]); // SATIR BOŞ DEĞİL

  const accordionIndex =
    rowNotEmpty && isValidVariable(rowData?.[INCONELTABLE_ROW_ACCORDION_INDEX]) ? rowData[INCONELTABLE_ROW_ACCORDION_INDEX] : null;
  const rowNotAccordion = accordionIndex === null; // SATIR ACCORDION İÇİNDE DEĞİL
  const rowIsCustomAccordion = !rowNotAccordion && rowData[INCONELTABLE_ROW_ACCORDION_CUSTOM];

  const {
    preventDeselect,
    selectedRows,
    setSelectedRows,
    showCheckboxColumn,
    selectActiveAction,
    enabled: selectionEnabled,
    dragSelectionIsEnabled,
    dragSelectionMode,
    handleSelectionDragStart,
    handleSelectionDragEnter,
    handleSelectionDragEnd,
  } = selection;
  const {
    subDataKey,
    accordionState,
    handleAccordionClick,
    customHeight,
    customAccordion,
    accordionFullData,
    enabled: accordionEnabled,
  } = accordion;

  const { loadMoreAction, moreDataWaiting } = scrollable;

  let disableSelectByAction = typeof selectActiveAction === 'function' ? selectActiveAction({ rowData, rowNumber }) : null;
  disableSelectByAction = isValidVariable(disableSelectByAction) && disableSelectByAction === false;

  const canRowSelect = selectionEnabled && rowNotEmpty && rowNotAccordion && !disableSelectByAction;
  const rowIsSelected = rowNotEmpty && rowNotAccordion ? selectedRows.includes(rowNumber) : false;

  const accordionData = getValueFromSource({ source: rowData, path: subDataKey, defaultValue: null });
  let canAccordionClickable = accordionEnabled && rowNotEmpty && rowNotAccordion && Array.isArray(accordionData);

  canAccordionClickable = canAccordionClickable && accordionFullData && accordionData.length === 0 ? false : canAccordionClickable;

  // const accordionIsActive = rowNumber === accordionState.no && rowNotAccordion;
  const accordionIsActive = rowData?.[INCONELTABLE_ROW_INDEX] === accordionState.no && rowNotAccordion;

  const checkboxLeftPosition = accordionEnabled ? 30 : 0;

  const rootClass = `${INCONELTABLE_MAIN_CLASSNAME}-row-item`;

  let className = `${rootClass} ${rootClass}-${rowNumber % 2 === 0 ? 'odd' : 'even'}`;
  className += rowNotAccordion ? ` ${rootClass}-${rowNumber}` : ` ${rootClass}-${rowNumber}-${accordionIndex}`;

  className += rowNotEmpty && hoverEffect ? ` ${rootClass}-hover` : '';
  className += rowNotEmpty && rowIsSelected ? ` ${rootClass}-selected` : '';
  className += !rowNotAccordion ? ` ${rootClass}-accordion` : '';

  let conditionalStyles = null;
  if (rowNotEmpty && Array.isArray(conditionalStyling) && isValidVariable(rowData?.[INCONELTABLE_ROW_VALUES])) {
    const defaultObj = {};

    Object.keys(columns).forEach((cid) => {
      if (!itemIsGroup(cid)) {
        defaultObj[cid] = { classList: [], style: {} };
      }
    });

    conditionalStyles = checkConditionalStyles(rowData, defaultObj, conditionalStyling, rowData[INCONELTABLE_ROW_VALUES]);
  }

  const { leftHolderWidth, leftContentWidth, centerHolderWidth, centerContentWidth, rightHolderWidth, rightContentWidth } =
    tableSectionSizes;

  const tableWidth = rightHolderWidth + centerHolderWidth + leftHolderWidth;
  const canSelectionDrag = dragSelectionIsEnabled && !preventDeselect && rowNotAccordion && rowNotEmpty;

  const updateSelectState = (isAdd) => {
    if (!(preventDeselect && rowIsSelected)) {
      setSelectedRows({ index: rowNumber, type: isAdd ? SELECTION_ADD : SELECTION_REMOVE });
    }
  };

  const getSectionJsx = (idList, rowNo, type) => {
    if (idList.length === 0) {
      return null;
    }

    const sectionClass = `${rootClass}-${type}`;
    let holderWidth = 0;
    let contentWidth = 0;

    switch (type) {
      case 'left':
        holderWidth = leftHolderWidth;
        contentWidth = leftContentWidth;
        break;
      case 'center':
        holderWidth = centerHolderWidth;
        contentWidth = centerContentWidth;
        break;
      case 'right':
        holderWidth = rightHolderWidth;
        contentWidth = rightContentWidth;
        break;
      default:
        holderWidth = 0;
    }

    return (
      <div className={sectionClass} style={{ width: `${holderWidth}px` }}>
        <div className={`${sectionClass}-content`} style={{ width: `${contentWidth}px` }}>
          {idList.map((colId, index) => {
            const widthFromCache = isValidVariable(columnWidthList[colId]) ? columnWidthList[colId] : null;
            const widthFromHeader = isValidVariable(elementPropsObject[colId]?.width) ? elementPropsObject[colId].width : null;

            return (
              <CellSection
                key={index}
                id={colId}
                rowData={rowData}
                columnProps={columns[colId]}
                rowNumber={rowNo}
                width={Math.max(widthFromCache, widthFromHeader)}
                height={rowHeight}
                rowNotEmpty={rowNotEmpty}
                rowNotAccordion={rowNotAccordion}
                showGroupBorder={groupBordersObject[colId]}
                canAccordionClickable={canAccordionClickable}
                maxWidthAllowed={maxWidthAllowed}
                conditionalStyles={conditionalStyles}
                disableSelectByAction={disableSelectByAction}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const handleDragStart = (e) => {
    const img = new Image();
    e.dataTransfer.setDragImage(img, 0, 0);

    handleSelectionDragStart?.(rowNumber, !rowIsSelected);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();

    handleSelectionDragEnter?.(rowNumber);
  };

  const handleDragEnd = (e) => {
    handleSelectionDragEnd?.(rowNumber);
  };

  const getRowContentJsx = () => {
    if (rowData?.[INCONELTABLE_ROW_LOADMORE]) {
      return (
        <div
          role="button"
          className={`${INCONELTABLE_MAIN_CLASSNAME}-load-more${moreDataWaiting ? ' data-waiting' : ''}`}
          onClick={moreDataWaiting ? null : () => loadMoreAction()}
        >
          {getLanguageText('loadMore')}
        </div>
      );
    }

    return (
      <>
        {/* SYSTEM AREA - ACCORDION ICON & SELECTION CHECK */}
        {systemColumnsWidth > 0 && !allColumnsHided && (
          <div className={`${INCONELTABLE_MAIN_CLASSNAME}-system-col`} style={{ width: `${systemColumnsWidth}px` }}>
            {accordionEnabled && (
              <div className={`${INCONELTABLE_MAIN_CLASSNAME}-accordion-col`}>
                {canAccordionClickable && (
                  <div
                    role="button"
                    className={`${INCONELTABLE_MAIN_CLASSNAME}-accordion-content`}
                    onClick={() => {
                      if (accordionIsActive) {
                        handleAccordionClick(null, null);
                      } else {
                        handleAccordionClick(rowNumber, rowData);
                      }
                    }}
                  >
                    <div className={`${INCONELTABLE_MAIN_CLASSNAME}-accordion-icon-${accordionIsActive ? 'minus' : 'plus'}`}>
                      <InconelSvg src={accordionIsActive ? MinusIcon : PlusIcon} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectionEnabled && showCheckboxColumn && (
              <div className={`${INCONELTABLE_MAIN_CLASSNAME}-checkbox-col`} style={{ left: `${checkboxLeftPosition}px` }}>
                {canRowSelect && (
                  <label className={`${INCONELTABLE_MAIN_CLASSNAME}-checkbox-content`}>
                    <input type="checkbox" checked={rowIsSelected} onChange={(e) => updateSelectState(e.target.checked)} />
                  </label>
                )}
              </div>
            )}
          </div>
        )}
        {/* CUSTOM ACCORDION CONTENT */}
        {rowIsCustomAccordion ? (
          <div
            className={`${INCONELTABLE_MAIN_CLASSNAME}-custom-accordion-container`}
            style={{
              position: 'absolute',
              height: `${customHeight}px`,
              width: `${tableWidth}px`,
              transform: `translateX(${systemColumnsWidth}px)`,
            }}
          >
            {customAccordion(customAccordionTriggerData)}
          </div>
        ) : (
          <>
            {/* STANDARD ROW CELLS */}
            {getSectionJsx(leftColList, rowNumber, 'left')}
            {getSectionJsx(centerColList, rowNumber, 'center')}
            {getSectionJsx(rightColList, rowNumber, 'right')}
          </>
        )}
      </>
    );
  };

  useLayoutEffect(() => {
    applyHorizontalScrollValues();
  });

  return (
    <div
      className={className}
      style={{ ...styleObject, whiteSpace: 'nowrap' }}
      onDragStart={canSelectionDrag && !dragSelectionMode ? handleDragStart : null}
      onDragEnter={canSelectionDrag ? handleDragEnter : null}
      onDragEnd={canSelectionDrag ? handleDragEnd : null}
      onDragOver={canSelectionDrag ? (e) => e.preventDefault() : null}
      draggable={canSelectionDrag && !dragSelectionMode}
    >
      {getRowContentJsx()}
    </div>
  );
};

RowItem.propTypes = {
  rowNumber: PropTypes.number,
  rowData: PropTypes.object,
  styleObject: PropTypes.object,
  tableSectionSizes: PropTypes.object,
  columnWidthList: PropTypes.object,
  rowHeight: PropTypes.number,
  elementPropsObject: PropTypes.object,
  leftColList: PropTypes.array,
  centerColList: PropTypes.array,
  rightColList: PropTypes.array,
  applyHorizontalScrollValues: PropTypes.func,
  groupBordersObject: PropTypes.object,
  customAccordionTriggerData: PropTypes.object,
  allColumnsHided: PropTypes.bool,
  maxWidthAllowed: PropTypes.bool,
};

export default RowItem;
