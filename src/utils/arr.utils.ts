export const arrImmutableReplaceAt = <A>(
  arr: A[],
  index: number,
  replacement: A
) => {
  return [...arr.slice(0, index), replacement, ...arr.slice(index + 1)];
};

export const arrImmutableDeleteAt = (arr: any[], index) => {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

export const arrImmutableInsertAt = (arr: any[], index: number, value: any) => {
  return [...arr.slice(0, index), value, ...arr.slice(index)];
};
