import { useState, useEffect, useContext, useMemo } from 'react';
// import PropTypes from 'prop-types';
import InconelSelect from 'components/Select';
import { INCONELTABLE_MAIN_CLASSNAME } from '../constants';

import { InconelTablePropsContext } from '../contexts/InconelTablePropsContext';

import './_inconelTablePagination.scss';

const InconelTablePagination = () => {
  const { showedDataLength, fullData, filtering, pageSize, getLanguageText, totalDataLength, pagination } =
    useContext(InconelTablePropsContext);

  const {
    rowCount,
    updateRowCount,
    showCombobox: pageSizeShowCombobox,
    options: pageSizeOptions,
    comboPosition
  } = pageSize;
  const { enabled: filteringEnabled } = filtering;
  const dataCount = filteringEnabled && fullData ? showedDataLength : totalDataLength;

  const { setPage, activePage, disabled } = pagination;

  const pageCount = Math.ceil(dataCount / pageSize.rowCount); // sayfa sayısı
  // const activePage = ( props.activePage > pageCount && pageCount > 0) ? pageCount : props.activePage;

  const [pageNumber, setPageNumber] = useState(activePage);

  const portalElement = useMemo(() => document.getElementById('reactPortal'), []);

  const rootCls = `${INCONELTABLE_MAIN_CLASSNAME}-pagination`;
  // rootCls += disabled ? ' is-disabled' : '';

  const getPageSizeComboJsx = () => {
    if (!pageSizeShowCombobox) {
      return null;
    }

    return (
      <div className={`${rootCls}-page-size`}>
        <InconelSelect
          className={`${rootCls}-page-size-combo xs-select`}
          size="xs"
          label=""
          menuPlacement="auto"
          maxMenuHeight={150}
          menuPortalTarget={portalElement ?? null}
          options={pageSizeOptions}
          onChange={(e) => {
            if (e !== null) {
              updateRowCount(e.value, true);
            }
          }}
          isDisabled={disabled}
          value={rowCount}
          isSearchable={false}
          singleValue
        />
      </div>
    );
  };

  // [1, 2, 3, 4, 5]
  const numericArrayGenerate = (start, count) => Array.apply(0, Array(count)).map((_item, index) => index + start);

  const handlePaginationClick = (pageNum, type) => {
    // type 	-> (string)  +, - , =
    let no = pageNumber;
    if (type === '=') {
      no = pageNum;
    } else if (type === '+') {
      no = no < pageCount ? no + 1 : no;
    } else if (type === '-') {
      no = no > 1 ? no - 1 : no;
    }

    setPage(no);
    setPageNumber(no);
  };

  const navigationRender = () => {
    const navSize = 7; // navigasyonda gözükecek eleman sayısı

    let numArray = [];
    // 1,2,3,4,5,6,7,8,9,10
    // 1->   1, 2,3,4, ...8
    // 2->   1, 2,3,4, ...8
    // 3->   1, 2,3,4, ...8
    // 4->   1, ...3,4,5, ...8
    // 5->   1, ...4,5,6, ...8
    // 6->   1, ...5,6,7, 8
    // 7->   1, ...5,6,7, 8
    // 8->   1, ...5,6,7, 8

    if (pageCount <= navSize) {
      numArray = numericArrayGenerate(1, pageCount);
    } else {
      const centerSize = navSize - 2; // for first and last
      let startIndex = pageNumber - (Math.ceil(centerSize / 2) - 1);
      startIndex = startIndex < 2 ? 2 : startIndex;
      startIndex = startIndex > pageCount - centerSize ? pageCount - centerSize : startIndex;

      numArray = numericArrayGenerate(startIndex, centerSize);
      numArray = [1, ...numArray, pageCount];
    }

    const prevButtonClass = pageNumber === 1 ? ` ${rootCls}-disabled` : '';
    const nextButtonClass = pageNumber === pageCount ? ` ${rootCls}-disabled` : '';

    return (
      <>
        <div
          role="button"
          className={`${rootCls}-prev${prevButtonClass}`}
          onClick={pageNumber === 1 || disabled ? null : () => handlePaginationClick(1, '-')}
        >
          {getLanguageText('prevPage')}
        </div>
        {numArray.map((item, index) => {
          const isActive = item === pageNumber;
          let dots = index === 1 && item > 2 ? '...' : '';
          dots = index === numArray.length - 1 && item > numArray[index - 1] + 1 ? '...' : dots;

          const activeClassName = isActive ? ` ${rootCls}-active` : '';

          return (
            <div
              key={index}
              role="button"
              className={`${rootCls}-num${activeClassName}`}
              onClick={!isActive && !disabled ? () => handlePaginationClick(item, '=') : null}
            >
              {dots + item}
            </div>
          );
        })}
        <div
          role="button"
          className={`${rootCls}-next${nextButtonClass}`}
          onClick={pageNumber === pageCount || disabled ? null : () => handlePaginationClick(1, '+')}
        >
          {getLanguageText('nextPage')}
        </div>
      </>
    );
  };

  useEffect(() => {
    setPageNumber(activePage);
  }, [activePage]);

  /*
  if (totalDataLength === 0 || pageCount === 0) {
    return null;
  }
	*/

  return (
    <div className={`${rootCls}${disabled ? ' is-disabled' : ''}`}>
      {pageNumber !== -1 && totalDataLength > 0 && (
        <>
          {comboPosition === 'bottomLeft' ? getPageSizeComboJsx() : null}
          {navigationRender(pageNumber)}
          {comboPosition === 'bottomRight' ? getPageSizeComboJsx() : null}
        </>
      )}
    </div>
  );
};

InconelTablePagination.propTypes = {};

export default InconelTablePagination;
