import { cloneDeep, isEqual } from 'lodash';
import { useEffect, useRef } from 'react';

export const useInconelEffect = (effectFunc, depList, runInitial = true) => {
  const listRef = useRef({});
  const firstRun = useRef(true);

  useEffect(() => {
    let isChange = false;
    depList.forEach((item, index) => {
      if (listRef.current[index] === undefined) {
        isChange = true;
      } else {
        isChange = !isEqual(item, listRef.current[index]) ? true : isChange;
      }

      listRef.current[index] = cloneDeep(item);
    });

    if (isChange && typeof effectFunc === 'function') {
      if (runInitial || !firstRun.current) {
        effectFunc();
      } else {
        firstRun.current = false;
      }
    }
  }, [...depList]);

  /*
  useEffect(() => {
    return () => {
      console.log('unmounted', depList);
    };
  }, []);
	*/

  return { effectFunc, depList };
};
