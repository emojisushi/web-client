type Key = {
  name: string;
  version: string;
};

export const setToLocalStorage = (key: Key, value: any) => {
  localStorage.setItem(
    key.name,
    JSON.stringify({
      state: value,
      version: key.version,
    })
  );
};

export const getFromLocalStorage = (key: Key) => {
  try {
    const result = JSON.parse(localStorage.getItem(key.name));
    if (result?.version !== key.version) {
      removeFromLocalStorage(key);
      return null;
    }
    return result?.state;
  } catch (e) {
    console.error("ls error" + e.toString());
    return null;
  }
};

export const removeFromLocalStorage = (key: Key) => {
  localStorage.removeItem(key.name);
};

export const localStorageHas = (key: Key) => {
  return key.name in localStorage;
};
