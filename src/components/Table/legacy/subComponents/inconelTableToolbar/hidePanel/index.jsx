import React, { useContext, useMemo } from 'react';

import { INCONELTABLE_MAIN_CLASSNAME } from '../../constants';
import { InconelTablePropsContext } from '../../contexts/InconelTablePropsContext';
import { itemIsGroup } from '../../utils';

import './_hidePanel.scss';

const HidePanel = () => {
  const { tableId, setInitialOptionStates, columns, defaultColumnOrder, hideArray, getLanguageText } = useContext(
    InconelTablePropsContext,
  );

  const rootClass = `${INCONELTABLE_MAIN_CLASSNAME}-hide-panel`;

  const handleShowAllClick = () => {
    let newHideArray = [];
    if (hideArray.length === 0) {
      newHideArray = [...allHideList];
    }

    setInitialOptionStates(newHideArray, 'hide');
  };

  const handleCheckboxChanged = (e, checkId) => {
    let newHideArray = [];
    const idList = columns[checkId].groupFlatList.filter(listId => selectableIdsList.includes(listId));

    if (e.target.checked) {
      newHideArray = hideArray.filter(hideId => !idList.includes(hideId));
    } else {
      newHideArray = [...hideArray, ...idList];
    }

    setInitialOptionStates(newHideArray, 'hide');
  };

  const getItemTitle = title => <>{typeof title === 'function' ? <div>{title()}</div> : <span>{title}</span>}</>;

  const getItemStatus = itemId => {
    const itemObject = columns[itemId];
    const isGroup = itemIsGroup(itemId);
    let isVisible = true;
    let isChecked = true;
    let isDisabled = false;

    if (isGroup) {
      const subIdsList = itemObject.cols;
      let notVisibleCount = 0;
      let notSelectableCount = 0;
      let checkedItemCount = 0;

      subIdsList.forEach(subId => {
        const subIsVisible = getItemStatus(subId).isVisible;
        const subIsDisabled = getItemStatus(subId).isDisabled;
        const subIsChecked = getItemStatus(subId).isChecked;

        notVisibleCount += !subIsVisible ? 1 : 0;
        notSelectableCount += !subIsVisible || subIsDisabled ? 1 : 0;
        checkedItemCount += !subIsVisible || subIsDisabled || subIsChecked ? 1 : 0;
      });

      isVisible = subIdsList.length !== notVisibleCount;
      isChecked = subIdsList.length === checkedItemCount;
      isDisabled = subIdsList.length === notSelectableCount;
    } else {
      isVisible = itemObject.hideMenuVisible;
      isChecked = !hideArray.includes(itemId);
      isDisabled = !itemObject.hideMenuSelectable;
    }

    return { isVisible, isChecked, isDisabled, isGroup };
  };

  const [memoizedList, selectableIdsList, allHideList] = useMemo(() => {
    const getSectionKeys = colId => {
      const keyList = [colId];

      if (itemIsGroup(colId)) {
        columns[colId].cols.forEach(subId => {
          keyList.push(...getSectionKeys(subId));
        });
      }

      return keyList;
    };

    const getListSectionItems = () => {
      const resultList = [];
      defaultColumnOrder.forEach(orderId => {
        resultList.push(...getSectionKeys(orderId));
      });

      return resultList;
    };

    const memList = getListSectionItems();
    const selList = memList.filter(memId => {
      const itemStatus = getItemStatus(memId);

      return !(itemStatus.isDisabled || !itemStatus.isVisible);
    });

    const allHide = selList.filter(selId => !itemIsGroup(selId));

    return [memList, selList, allHide];
  }, [JSON.stringify(columns), JSON.stringify(defaultColumnOrder)]);

  const createListSection = () =>
    memoizedList.map((listId, index) => {
      const colObject = columns[listId];
      const columnId = colObject.id;
      const itemStatus = getItemStatus(columnId);

      if (!itemStatus.isVisible) {
        return null;
      }

      const checkboxId = `${tableId}-hide-check-${index}`;
      const indentSize = (colObject.level - 1) * 20;

      let labelClassEndString = typeof colObject.title === 'function' ? '-custom' : '';
      labelClassEndString += itemStatus.isGroup ? ' list-title-bold' : '';

      const disabledClass = itemStatus.isDisabled ? ` ${INCONELTABLE_MAIN_CLASSNAME}-hide-panel-disabled` : '';

      return (
        <div
          className={`${rootClass}-list-item${disabledClass}`}
          style={{ left: `${indentSize}px`, width: `calc(100% - ${indentSize}px)` }}
          key={index}
        >
          <input
            type="checkbox"
            id={checkboxId}
            name={checkboxId}
            disabled={itemStatus.isDisabled}
            checked={itemStatus.isChecked}
            onChange={itemStatus.isDisabled ? null : e => handleCheckboxChanged(e, listId)}
          />
          <label htmlFor={checkboxId} className={`${rootClass}-list-item-title${labelClassEndString}`}>
            {getItemTitle(colObject.title)}
          </label>
        </div>
      );
    });

  return (
    <div className={rootClass}>
      <div className={`${rootClass}-list`}>{createListSection()}</div>
      <div className={`${rootClass}-footer`}>
        <div className={`${rootClass}-footer-button`} role="button" onClick={handleShowAllClick}>
          {getLanguageText(hideArray.length === 0 ? 'hideAll' : 'showAll')}
        </div>
      </div>
    </div>
  );
};

export default HidePanel;
