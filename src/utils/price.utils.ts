export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatUAHPrice = (price: number) => {
  return `${numberWithCommas(price)} ₴`;
};
