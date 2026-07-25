import { useId, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { getGridColumnCss, mergeClassNames } from './utils';
import { DEFAULT_COPY_PROPS } from './constants';

import TableBody from './subComponents/tableBody';
import './_index.scss';
import TableHeaderItem from './subComponents/tableHeaderItem/index';

const InconelExcelTable = ({
  id,
  className,
  data,
  columns,
  viewCount = 10,
  rowHeight = 30,
  copy = { ...DEFAULT_COPY_PROPS },
  theme = 'light',
  dragStatus = null,
  bodyCellPositions = null
}) => {
  const uniqueId = useId();

  const copyProps = { ...DEFAULT_COPY_PROPS, ...(copy ?? {}) };
  const themeCls = theme === 'light' ? 'is-light' : 'is-dark';
  const mainCls = mergeClassNames('inconel-excel-table', themeCls, className);
  const tableId = id ?? uniqueId ?? null;
  const dataArray = Array.isArray(data) ? data : [];

  const holderRef = useRef(null);

  const holderHeight = useMemo(() => {
    if (!viewCount) {
      return 'auto';
    }

    const total = viewCount * rowHeight + rowHeight;

    return `${total}px`;
  }, [viewCount, rowHeight]);

  const [headerJsx, gridTemplateColumns] = useMemo(() => {
    if (!Array.isArray(columns) || columns.length === 0) {
      return [null, null];
    }
    const result = [];
    const cssList = [];

    columns.forEach(({ title, headerClassName, minWidth, maxWidth, pinLeft, pinRight }, index) => {
      cssList.push(getGridColumnCss({ min: minWidth, max: maxWidth }));

      result.push(
        <TableHeaderItem
          key={`item-${index}`}
          headerClassName={headerClassName}
          title={title}
          rowHeight={rowHeight}
          bodyCellPositions={bodyCellPositions}
          pinLeft={pinLeft}
          pinRight={pinRight}
        />
      );
    });

    return [result, cssList.join(' ')];
  }, [columns, rowHeight]);

  return (
    <div id={tableId} className={mainCls} ref={holderRef}>
      <div className="table-holder" style={{ height: holderHeight }}>
        <div className="table-content" style={{ gridTemplateColumns, gridTemplateRows: `repeat(auto-fill, ${rowHeight}px)` }}>
          <div className="header-holder">{headerJsx}</div>
          <TableBody
            ref={holderRef}
            dataArray={dataArray}
            dragStatus={(e) => dragStatus?.(e)}
            bodyCellPositions={(e) => bodyCellPositions?.(e)}
            columns={columns}
            rowHeight={rowHeight}
            copy={copyProps}
          />
        </div>
      </div>
    </div>
  );
};

InconelExcelTable.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      dataKey: PropTypes.string,
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element]),
      cellClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func]),
      headerClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func]),
      minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      cell: PropTypes.func,
      pinLeft: PropTypes.bool,
      pinRight: PropTypes.bool
    })
  ),
  viewCount: PropTypes.number,
  rowHeight: PropTypes.number,
  copy: PropTypes.shape({
    enabled: PropTypes.bool,
    setData: PropTypes.func,
    copyAction: PropTypes.func,
    onPasteAction: PropTypes.func,
    onKeyboardAction: PropTypes.func,
    disabledRowCountFromTop: PropTypes.number,
    disabledRowCountFromBottom: PropTypes.number,
    passiveColumns: PropTypes.array,
    showPreviewLabel: PropTypes.bool
  }),
  theme: PropTypes.oneOf(['dark', 'light']),
  dragStatus: PropTypes.func,
  bodyCellPositions: PropTypes.func
};

export default InconelExcelTable;
