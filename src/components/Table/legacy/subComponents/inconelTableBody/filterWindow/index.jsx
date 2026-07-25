/* eslint-disable jsx-a11y/label-has-associated-control */
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import CloseIcon from 'assets/icons/close-2.svg';
import InconelSvg from 'components/Svg';

import { INCONELTABLE_MAIN_CLASSNAME, INCONELTABLE_AUTO, INCONELTABLE_FILTER_EMPTY_VALUE } from '../../constants';
import { getElementRect, isValidVariable } from '../../utils';
import { InconelTablePropsContext } from '../../contexts/InconelTablePropsContext';
import './filterWindow.scss';

const FilterWindow = ({ positionX = 0 }) => {
  const { mainComponentElement, columns, filtering, convertUpperCase, getLanguageText } = useContext(InconelTablePropsContext);

  const {
    updateFilter,
    filteringList,
    filterWindowId,
    setFilterWindowId,
    customFilterFunction,
    filterButtonShow,
    lookupsAndCounts,
    windowHeight: filterPropHeight,
    onChange: filterOnChange,
  } = filtering ?? {};

  const customWindowContent = typeof customFilterFunction === 'function' ? customFilterFunction(filterWindowId) : null;
  const isCustomWindow = isValidVariable(customWindowContent);
  const thisFilterList = Array.isArray(filteringList?.[filterWindowId]) ? filteringList[filterWindowId] : [];

  const filterLookup = useRef(Array.isArray(lookupsAndCounts?.data?.[filterWindowId]) ? lookupsAndCounts.data[filterWindowId] : []);
  const [unselectedItems, setUnselectedItems] = useState([...thisFilterList]);
  const allSelected = thisFilterList.length === 0;

  const [inputText, setInputText] = useState('');
  const [windowHeight, setWindowHeight] = useState(0);
  const windowRef = useRef(null);
  const inputRef = useRef(null);

  const emptyValuesText = getLanguageText('emptyValues');
  const headerHeight = 70;
  const footerHeight = filterButtonShow ? 50 : 25;
  const bodyHeight = windowHeight - (headerHeight + footerHeight);
  const searchedLookup = filterLookup.current.filter((item) => {
    const trimmedInputText = convertUpperCase(inputText.trim());

    if (trimmedInputText === '') {
      return true;
    }

    return convertUpperCase(item.value === INCONELTABLE_FILTER_EMPTY_VALUE ? emptyValuesText : item.value).indexOf(trimmedInputText) !== -1;
  });

  const inputPlaceholder = isValidVariable(columns?.[filterWindowId]?.title) ? columns[filterWindowId].title : '';

  const rootClass = `${INCONELTABLE_MAIN_CLASSNAME}-filter-window`;

  let className = rootClass;
  className += isCustomWindow ? ` ${rootClass}-custom` : '';

  const getSelectedItemCount = () => filterLookup.current.filter((item) => getValueIsSelected(item?.value)).length;

  const getValueIsSelected = (value) => {
    if (filterButtonShow) {
      return !unselectedItems.includes(value);
    }

    return !thisFilterList.includes(value);
  };

  const countText = `${getSelectedItemCount()}/${filterLookup.current.length} ${getLanguageText('selectedItem')}`;

  const handleSelectAllClick = () => {
    const currentList = filterButtonShow ? [...unselectedItems] : filterLookup.current.map((lookupItem) => lookupItem?.value);
    const newList = allSelected ? currentList : [];

    filterOnChange?.({
      columnId: filterWindowId,
      selectedCount: allSelected ? 0 : filterLookup.current.length,
      totalCount: filterLookup.current.length,
      allSelected: !allSelected,
      checkValue: null,
      isChecked: null,
    });

    if (filterButtonShow) {
      setUnselectedItems(() => newList);
    } else {
      updateFilter({ id: filterWindowId, list: newList });
    }
  };

  const handleCheckboxChanged = (e, checkValue) => {
    let newList = filterButtonShow ? [...unselectedItems] : [...thisFilterList];
    const isChecked = e?.target?.checked;

    if (isChecked) {
      newList = newList.filter((filterItem) => filterItem !== checkValue);
    } else {
      newList.push(checkValue);
    }

    const addedVal = isChecked ? 1 : -1;
    filterOnChange?.({
      columnId: filterWindowId,
      selectedCount: getSelectedItemCount() + addedVal,
      totalCount: filterLookup.current.length,
      allSelected: getSelectedItemCount() + addedVal === filterLookup.current.length,
      checkValue,
      isChecked,
    });

    if (filterButtonShow) {
      setUnselectedItems(() => newList);
    } else {
      updateFilter({ id: filterWindowId, list: newList });
    }
  };

  const handleFilterButtonClick = () => {
    updateFilter({ id: filterWindowId, list: unselectedItems });
  };

  const handleFilterOutsideClick = (e) => {
    let val1 = true;
    let val2 = true;

    const filterIconElement = mainComponentElement.querySelector(
      `.inconeltable-header-item-id-${filterWindowId} .inconeltable-header-item-filter-icon`,
    );

    if (windowRef.current !== null) {
      val1 = windowRef.current.contains(e.target);
    }

    if (filterIconElement !== null) {
      val2 = filterIconElement.contains(e.target);
    }

    if (!val1 && !val2) {
      setFilterWindowId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleFilterOutsideClick);

    if (inputRef.current !== null) {
      inputRef.current.focus();
    }

    return () => {
      document.removeEventListener('mousedown', handleFilterOutsideClick);
    };
  }, []);

  useLayoutEffect(() => {
    if (mainComponentElement !== null) {
      const tableElement = mainComponentElement.querySelector(`.${INCONELTABLE_MAIN_CLASSNAME}-table-container`);

      if (tableElement !== null) {
        const { height: tableHeight } = getElementRect(tableElement);
        let winH = filterPropHeight === INCONELTABLE_AUTO ? tableHeight : filterPropHeight;
        winH = Math.max(winH, 100);

        setWindowHeight(() => winH);
      }
    }
  }, []);

  return (
    <div
      ref={windowRef}
      className={className}
      style={{ height: isCustomWindow ? 'auto' : `${windowHeight}px`, transform: `translateX(${positionX}px)` }}
    >
      {!isCustomWindow ? (
        <>
          <div className={`${rootClass}-header`} style={{ height: `${headerHeight}px` }}>
            <div className={`${rootClass}-header-input-holder`}>
              <input
                type="text"
                maxLength={250}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={inputPlaceholder}
                ref={inputRef}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <div role="button" className={`${rootClass}-header-input-clear`} onClick={() => setInputText('')}>
                <InconelSvg src={CloseIcon} />
              </div>
            </div>
            <div role="button" className={`${rootClass}-header-select-all`} onClick={handleSelectAllClick}>
              {allSelected ? getLanguageText('deselectAll') : getLanguageText('selectAll')}
            </div>
          </div>
          <div className={`${rootClass}-body`} style={{ height: `${bodyHeight}px` }}>
            <div className={`${rootClass}-body-list`}>
              {searchedLookup.length === 0 ? (
                <span className={`${rootClass}-body-list-nodata`}>{getLanguageText('filterNoData')}</span>
              ) : (
                searchedLookup.map((item, index) => (
                  <div role="button" key={index} className={`${rootClass}-body-list-item`}>
                    <label>
                      <input
                        type="checkbox"
                        checked={getValueIsSelected(item?.value)}
                        onChange={(e) => handleCheckboxChanged(e, item?.value)}
                      />
                      {item?.label === INCONELTABLE_FILTER_EMPTY_VALUE ? (
                        <span className="emptyItem">{emptyValuesText}</span>
                      ) : (
                        <span>{item.label}</span>
                      )}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className={`${rootClass}-footer`} style={{ height: `${footerHeight}px` }}>
            <div className={`${rootClass}-footer-count`}>{countText}</div>
            {filterButtonShow && (
              <div className={`${rootClass}-footer-button`} role="button" onClick={handleFilterButtonClick}>
                {getLanguageText('applyFilter')}
              </div>
            )}
          </div>
        </>
      ) : (
        customWindowContent
      )}
    </div>
  );
};

FilterWindow.propTypes = {
  positionX: PropTypes.number,
};

export default FilterWindow;
