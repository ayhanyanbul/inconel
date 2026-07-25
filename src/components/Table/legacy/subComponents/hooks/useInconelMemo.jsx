import { cloneDeep, isEqual } from 'lodash';
import { useRef } from 'react';

export const useInconelMemo = () => {
  const listRef = useRef({});
  const lastValueRef = useRef({});

  const inconelMemo = (effectFunc, depList, id) => {
    let isChange = false;
    if (listRef.current[id] === undefined) {
      listRef.current[id] = {};
    }

    depList.forEach((item, index) => {
      if (listRef.current[id][index] === undefined) {
        isChange = true;
      } else {
        isChange = !isEqual(item, listRef.current[id][index]) ? true : isChange;
      }

      listRef.current[id][index] = cloneDeep(item);
    });

    if (isChange && typeof effectFunc === 'function') {
      const resultFunc = effectFunc();
      lastValueRef.current[id] = resultFunc;
      return resultFunc;
    }

    return lastValueRef.current[id];
  };

  return { inconelMemo };
};
