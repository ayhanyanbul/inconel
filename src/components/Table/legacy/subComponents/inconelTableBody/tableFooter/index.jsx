import { useContext, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import { INCONELTABLE_MAIN_CLASSNAME } from '../../constants';
import { getDataOrderIds, isValidVariable } from '../../utils';
import { InconelTablePropsContext } from '../../contexts/InconelTablePropsContext';

import CellSection from '../cellSection';

import './_tableFooter.scss';

const TableFooter = ({
  visibleColumns,
  leftIdList,
  centerIdList,
  rightIdList,
  groupBordersObject,
  columnWidthList,
  elementPropsObject,
  maxWidthAllowed,
  tableSectionSizes,
  applyHorizontalScrollValues,
}) => {
  const { columns, cellHeight, systemColumnsWidth } = useContext(InconelTablePropsContext);

  const { rightContentWidth, rightHolderWidth, centerContentWidth, centerHolderWidth, leftContentWidth, leftHolderWidth } =
    tableSectionSizes;

  const rootCls = `${INCONELTABLE_MAIN_CLASSNAME}-footer`;

  const getFooterJsx = () => {
    const leftFooterColumns = [];
    const centerFooterColumns = [];
    const rightFooterColumns = [];

    leftIdList.forEach((item) => {
      leftFooterColumns.push(...getDataOrderIds(item, visibleColumns));
    });

    centerIdList.forEach((item) => {
      centerFooterColumns.push(...getDataOrderIds(item, visibleColumns));
    });

    rightIdList.forEach((item) => {
      rightFooterColumns.push(...getDataOrderIds(item, visibleColumns));
    });

    return (
      <>
        {renderSection(leftFooterColumns, 'left')}
        {renderSection(centerFooterColumns, 'center')}
        {renderSection(rightFooterColumns, 'right')}
      </>
    );
  };

  const renderSection = (idList, type) => {
    if (idList.length === 0) {
      return null;
    }

    let holderWidth = 0;
    let contentWidth = 0;

    if (type === 'left') {
      holderWidth = leftHolderWidth;
      contentWidth = leftContentWidth;
    } else if (type === 'center') {
      holderWidth = centerHolderWidth;
      contentWidth = centerContentWidth;
    } else if (type === 'right') {
      holderWidth = rightHolderWidth;
      contentWidth = rightContentWidth;
    }

    return (
      <div className={`${rootCls}-${type}`} style={{ width: `${holderWidth}px` }}>
        <div className={`${rootCls}-${type}-content`} style={{ width: `${contentWidth}px` }}>
          {idList.map((colId, index) => {
            const widthFromCache = isValidVariable(columnWidthList[colId]) ? columnWidthList[colId] : null;
            const widthFromHeader = isValidVariable(elementPropsObject[colId]?.width) ? elementPropsObject[colId].width : null;

            return (
              <CellSection
                key={index}
                id={colId}
                rowData={null}
                columnProps={columns[colId]}
                rowNumber={-1}
                width={Math.max(widthFromCache, widthFromHeader)}
                height={null}
                showGroupBorder={groupBordersObject[colId]}
                canAccordionClickable={false}
                maxWidthAllowed={maxWidthAllowed}
                rowNotEmpty
                rowNotAccordion
                isFooter
              />
            );
          })}
        </div>
      </div>
    );
  };

  useLayoutEffect(() => {
    applyHorizontalScrollValues();
  });

  return (
    <div className={rootCls} style={{ height: `${cellHeight}px`, paddingLeft: `${systemColumnsWidth}px` }}>
      {getFooterJsx()}
    </div>
  );
};

TableFooter.propTypes = {
  visibleColumns: PropTypes.object,
  leftIdList: PropTypes.array,
  centerIdList: PropTypes.array,
  rightIdList: PropTypes.array,
  groupBordersObject: PropTypes.object,
  columnWidthList: PropTypes.object,
  elementPropsObject: PropTypes.object,
  maxWidthAllowed: PropTypes.bool,
  tableSectionSizes: PropTypes.object,
  applyHorizontalScrollValues: PropTypes.func,
};

export default TableFooter;
