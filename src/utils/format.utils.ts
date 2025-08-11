export function addLeadingZero(number: number) {
  return "0".concat(number + "").slice(-2);
}
