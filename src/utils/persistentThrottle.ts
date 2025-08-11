export const persistentThrottle = (
  callback: () => void,
  options: {
    key: string;
    interval: number;
  }
) => {
  const { key, interval } = options;
  const lastTimeCallbackFired = localStorage.getItem(key);

  return () => {
    if (
      lastTimeCallbackFired &&
      +lastTimeCallbackFired + interval > Date.now()
    ) {
      return;
    }

    callback();

    localStorage.setItem(key, String(Date.now()));
  };
};
