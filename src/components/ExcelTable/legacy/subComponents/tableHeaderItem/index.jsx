import { useRef } from 'react';
import PropTypes from 'prop-types';
import { mergeClassNames } from '../../utils';
import './_index.scss';

const TableHeaderItem = ({
  headerClassName = null,
  title = null,
  rowHeight = null,
  bodyCellPositions = null,
  pinLeft = null,
  pinRight = null
}) => {
  const containerRef = useRef(null);
  let pinClass = null;

  if (pinLeft) {
    pinClass = 'pin-left';
  } else if (pinRight) {
    pinClass = 'pin-right';
  }
  const itemClass = mergeClassNames('inconel-excel-table-header-item', headerClassName, pinClass);

  return (
    <div
      ref={containerRef}
      role="button"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const { left, right, top, bottom, width, height } = rect || {};
        bodyCellPositions?.({ left, right, top, bottom, width, height, type: 'header' });
      }}
      className={itemClass}
      style={{ height: `${rowHeight}px` }}
    >
      {title}
    </div>
  );
};

TableHeaderItem.propTypes = {
  headerClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  rowHeight: PropTypes.number,
  bodyCellPositions: PropTypes.func,
  pinLeft: PropTypes.bool,
  pinRight: PropTypes.bool
};

export default TableHeaderItem;
