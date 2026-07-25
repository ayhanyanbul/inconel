import { createRef } from 'react';
import PropTypes from 'prop-types';

import HeaderItem from '../headerItem';
import { useInconelMemo } from '../../hooks/useInconelMemo';

// import AnimateDomElements from '../../animateDomElements';

const HeaderWrapper = ({
  idList,
  type,
  visibleColumns,
  groupBordersObject,
  handleContextPinMenu,
  handleDragStart,
  handleDragEnter,
  handleDrop,
  maxWidthAllowed,
}) => {
  // const { headerHeight } = useContext(InconelTablePropsContext);
  const { inconelMemo } = useInconelMemo();

  const [renderList, refList] = inconelMemo(
    () => {
      const renderArray = [];

      idList.forEach((listId) => {
        visibleColumns[listId].groupFlatList.forEach((itemId) => {
          renderArray.push(itemId);
        });
      });

      const list = renderArray.map(() => ({ ref: createRef() }));

      return [renderArray, list];
    },
    [idList, visibleColumns],
    0,
  );

  return (
    <>
      {renderList.map((itemId, index) => (
        <HeaderItem
          key={index}
          ref={refList[index].ref}
          id={String(itemId)}
          columnsObject={visibleColumns}
          pinType={type}
          showGroupBorder={groupBordersObject[itemId]}
          handleContextPinMenu={handleContextPinMenu}
          handleDragStart={handleDragStart}
          handleDragEnter={handleDragEnter}
          handleDrop={handleDrop}
          keyIndex={index}
          maxWidthAllowed={maxWidthAllowed}
        />
      ))}
    </>
  );
};

HeaderWrapper.propTypes = {
  idList: PropTypes.array,
  type: PropTypes.string,
  visibleColumns: PropTypes.object,
  groupBordersObject: PropTypes.object,
  handleContextPinMenu: PropTypes.func,
  handleDragStart: PropTypes.func,
  handleDragEnter: PropTypes.func,
  handleDrop: PropTypes.func,
  maxWidthAllowed: PropTypes.bool,
};

export default HeaderWrapper;
