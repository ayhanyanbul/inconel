import { forwardRef, useContext, useRef } from 'react';
import PropTypes from 'prop-types';

import FilterIcon from 'assets/icons/filter.svg';
import SortIcon from 'assets/icons/sort.svg';

import InconelSvg from 'components/Svg';
import { INCONELTABLE_MAIN_CLASSNAME, INCONELTABLE_PIN_ACCESS_NONE, INCONELTABLE_SORT_ASC, INCONELTABLE_SORT_DESC } from '../../constants';

import { isValidVariable } from '../../utils';
import { InconelTablePropsContext } from '../../contexts/InconelTablePropsContext';
import './_headerItem.scss';

const HeaderItem = forwardRef(
  (
    {
      id = null,
      columnsObject = null,
      pinType = 'center',
      showGroupBorder = false,
      handleContextPinMenu = null,
      handleDragStart = null,
      handleDragEnter = null,
      handleDrop = null,
      maxWidthAllowed = true,
    },
    ref,
  ) => {
    const { headerHeight, sorting, filtering, dragEnabled, pinEnabled, totalDataLength, dataLoadedFirstTime } =
      useContext(InconelTablePropsContext);

    const { title, headerClassName, customJsx, tooltip, minWidth, maxWidth, topElementId, locked, headerJsx } = columnsObject[id];

    const { activeSort, sortUpdate, isClearable, enabled: sortingEnabled, colList: sortingColList } = sorting;

    const {
      filterWindowId,
      showBubbles,
      lookupsAndCounts,
      setFilterWindowId,
      showFilterIconsOnStart,
      colList: filteringColList,
      enabled: filteringEnabled,
    } = filtering;

    const isSortable = totalDataLength > 0 && sortingEnabled && sortingColList.includes(id);
    const sortIsActive = isSortable && id === activeSort.col;

    const isFilterable = filteringEnabled && (dataLoadedFirstTime || showFilterIconsOnStart) && filteringColList.includes(id);
    const filterIsActive = filteringEnabled && id === filterWindowId;
    const sortTimeout = useRef(0);

    const filterBubbleCount =
      isFilterable && showBubbles && isValidVariable(lookupsAndCounts?.count?.[id]) ? lookupsAndCounts.count[id] : null;

    const rootClass = `${INCONELTABLE_MAIN_CLASSNAME}-header-item`;

    let className = rootClass;
    className += ` ${rootClass}-id-${id}`;
    className += ` ${rootClass}-pin-${pinType}`;
    className += filterIsActive ? ` ${rootClass}-filter-active` : '';
    className += isSortable || isFilterable ? ` ${rootClass}-space-between` : '';
    className += showGroupBorder ? ` ${INCONELTABLE_MAIN_CLASSNAME}-group-border` : '';
    className += headerClassName !== null ? ` ${headerClassName}` : '';

    let textClass = `${rootClass}-text`;
    textClass += isSortable ? ` ${rootClass}-sortable` : '';
    textClass += sortIsActive ? ` ${rootClass}-sort-is-active` : '';

    const targetId = topElementId === null ? id : topElementId;
    const { pinAccess, drag } = columnsObject[targetId];

    const headerCanPin = pinAccess !== INCONELTABLE_PIN_ACCESS_NONE && pinEnabled && !locked;
    const headerCanDrag = dragEnabled && drag && !locked;
    const styleObject = { minHeight: `${headerHeight}px` };

    if (minWidth !== null) {
      styleObject.minWidth = `${minWidth}px`;
    }

    if (maxWidthAllowed && maxWidth !== null) {
      styleObject.maxWidth = `${maxWidth}px`;
      className += ` ${INCONELTABLE_MAIN_CLASSNAME}-max-limit`;
    }

    const getSortIconJsx = () => {
      if (sortIsActive) {
        return (
          <div role="button" className={`${rootClass}-sorted-${activeSort.type}`} onClick={isSortable ? handleSort : null}>
            <InconelSvg src={SortIcon} />
          </div>
        );
      }

      if (isFilterable || isSortable) {
        return <div className={`${rootClass}-empty-area`} />;
      }

      return null;
    };

    const getFilterIconJsx = () => {
      if (isFilterable) {
        return (
          <>
            <div role="button" className={`${rootClass}-filter-icon`} onClick={filterIsActive ? null : () => setFilterWindowId(id)}>
              <InconelSvg src={FilterIcon} />
            </div>
            {filterBubbleCount !== null && <div className={`${rootClass}-filter-bubble`}>{filterBubbleCount}</div>}
          </>
        );
      }

      if (isSortable) {
        return <div className={`${rootClass}-empty-area`} />;
      }

      return null;
    };

    const updateSortStatus = () => {
      let newSortId = sortIsActive ? activeSort.col : id;
      let newSortType = INCONELTABLE_SORT_ASC;

      const clearValue = isClearable ? null : INCONELTABLE_SORT_ASC;

      if (sortIsActive) {
        newSortType = activeSort.type === INCONELTABLE_SORT_ASC ? INCONELTABLE_SORT_DESC : clearValue;
        newSortId = newSortType === null ? null : newSortId;
      }

      sortUpdate({ newSortId, newSortType });
    };

    const handleSort = () => {
      clearTimeout(sortTimeout.current);
      sortTimeout.current = setTimeout(updateSortStatus, 100);
    };

    const handleContextClick = (e) => {
      e.preventDefault();

      handleContextPinMenu(id, e.clientX, e.clientY);
    };

    return (
      <div
        className={className}
        title={tooltip}
        style={styleObject}
        onContextMenu={headerCanPin ? handleContextClick : null}
        draggable={headerCanDrag}
        onDragStart={headerCanDrag ? (e) => handleDragStart(e, pinType) : null}
        onDragEnter={headerCanDrag ? (e) => handleDragEnter(e, pinType) : null}
        onDragEnd={headerCanDrag ? (e) => handleDrop(e, pinType) : null}
        data-inconeltable-id={targetId}
        ref={ref}
      >
        <div className={`${rootClass}-content`}>
          {getFilterIconJsx()}
          <div role="button" className={textClass} onClick={isSortable ? handleSort : null}>
            {typeof title === 'function' ? title() : title}
          </div>
          {getSortIconJsx()}
          {typeof customJsx === 'function' && customJsx()}
        </div>
        {typeof headerJsx === 'function' && headerJsx(id)}
      </div>
    );
  },
);

HeaderItem.propTypes = {
  id: PropTypes.string,
  columnsObject: PropTypes.object,
  pinType: PropTypes.oneOf(['left', 'center', 'right']),
  showGroupBorder: PropTypes.bool,
  handleContextPinMenu: PropTypes.func,
  handleDragStart: PropTypes.func,
  handleDragEnter: PropTypes.func,
  handleDrop: PropTypes.func,
  maxWidthAllowed: PropTypes.bool,
};

export default HeaderItem;
