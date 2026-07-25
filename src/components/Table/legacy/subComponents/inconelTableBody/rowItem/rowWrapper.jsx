import { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import RowItem from './index';
import { INCONELTABLE_ROW_ACCORDION_CUSTOM, INCONELTABLE_ROW_INDEX } from '../../constants';
import { InconelTablePropsContext } from '../../contexts/InconelTablePropsContext';

const RowWrapper = memo(({ data, index, style }) => {
  const { showData } = useContext(InconelTablePropsContext);

  const {
    tableSectionSizes,
    columnWidthList,
    elementPropsObject,
    leftColList,
    centerColList,
    rightColList,
    applyHorizontalScrollValues,
    groupBordersObject,
    rowStartIndex,
    rowHeightCache,
    allColumnsHided,
    maxWidthAllowed,
  } = data ?? {};

  const rowData = showData[index];

  const rowNumber = rowData === null ? rowStartIndex + index : rowData?.[INCONELTABLE_ROW_INDEX];
  const rowHeight = rowHeightCache[index];

  const customAccordionTriggerData = rowData?.[INCONELTABLE_ROW_ACCORDION_CUSTOM] ? showData[index - 1] : rowData;

  return (
    <RowItem
      rowNumber={rowNumber}
      rowData={rowData}
      styleObject={style}
      tableSectionSizes={tableSectionSizes}
      columnWidthList={columnWidthList}
      rowHeight={rowHeight}
      elementPropsObject={elementPropsObject}
      leftColList={leftColList}
      centerColList={centerColList}
      rightColList={rightColList}
      applyHorizontalScrollValues={applyHorizontalScrollValues}
      groupBordersObject={groupBordersObject}
      customAccordionTriggerData={customAccordionTriggerData}
      allColumnsHided={allColumnsHided}
      maxWidthAllowed={maxWidthAllowed}
    />
  );
});

RowWrapper.propTypes = {
  data: PropTypes.object,
  index: PropTypes.number,
  style: PropTypes.object,
};

export default RowWrapper;
