export const generateHash = (n) => {
  // @ts-ignore
  return [...Array(n)].map((_) => (Math.random() * 10) | 0).join``;
};
