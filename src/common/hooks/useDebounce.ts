import React from "react";
import { debounce } from "~utils/debounce";

export function useDebounce<R, A extends any[]>(
  callback: (...args: A) => R,
  delay: number,
  onFire?: () => void
) {
  const callbackRef = React.useRef<(...args: A) => R>(callback);
  // Why useLayoutEffect? -> https://kcd.im/uselayouteffect
  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });
  return React.useMemo(
    () => debounce((...args: A) => callbackRef.current(...args), delay, onFire),
    [delay, onFire]
  );
}
