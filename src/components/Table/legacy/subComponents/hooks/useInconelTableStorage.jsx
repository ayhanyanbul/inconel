const memoryStorage = new Map();

const getStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // Sandboxed browsers and test environments may block localStorage.
  }

  return {
    getItem: key => memoryStorage.get(key) ?? null,
    setItem: (key, value) => memoryStorage.set(key, value)
  };
};

export const useInconelTableStorage = ({ storageMainKey = 'INCONELTABLE', isCrypto = true } = {}) => {
  /*
		STORAGE STRUCTURE
		
		INCONELTABLE = {
			announcement-table: { order:['0', '1', '2'], hide:['0'], pinLeft:['1'], pinRight:['2'] },
			order-table: { order:[], hide:[], pinLeft:[], pinRight:[] }
		}
	*/

  const isValidVariable = val => val !== null && val !== undefined;

  const isObject = val => isValidVariable(val) && !Array.isArray(val) && typeof val === 'object';

  const encodeString = str => (isCrypto ? window.btoa(str) : str); // return "abcd45mn"

  const decodeString = str => (isCrypto ? window.atob(str) : str); // return "{key, value}"

  const getMainStorage = () => {
    const storage = getStorage().getItem(storageMainKey);

    if (isValidVariable(storage)) {
      try {
        return JSON.parse(decodeString(storage));
      } catch (err) {
        return null;
      }
    }

    return null;
  };

  const getItem = subKey => {
    const mainStorage = getMainStorage(); // return storage as object

    if (isObject(mainStorage?.[subKey])) {
      return mainStorage[subKey];
    }

    return null;
  };

  const setItem = (subKey, val) => {
    // val => { order:[], hide:[], pinLeft:[], pinRight:[] }

    if (!isValidVariable(subKey)) {
      return null;
    }

    let newStorage = getMainStorage(); // return storage as object
    newStorage = isObject(newStorage) ? newStorage : {};

    if (isValidVariable(val)) {
      newStorage[subKey] = val;
    } else {
      delete newStorage?.[subKey];
    }

    const dataString = JSON.stringify(newStorage);

    getStorage().setItem(storageMainKey, encodeString(dataString));

    return true;
  };

  return { getItem, setItem };
};
