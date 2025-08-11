export function debounce<R, A extends any[]>(
  fn: (...args: A) => R,
  delay: number,
  onFire?: () => void
) {
  let timer;
  return [
    (...args: A) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        onFire?.();
        fn(...args);
      }, delay);
    },
    () => {
      clearTimeout(timer);
    },
  ] as const;
}
