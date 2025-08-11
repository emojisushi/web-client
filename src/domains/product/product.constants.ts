import { numericSorter } from "~utils/sort.utils";
import { IProduct } from "@layerok/emojisushi-js-sdk";

export const priceLowSorter = numericSorter<IProduct>(
  (p) => p.prices[0].price,
  "asc"
);

export const priceHighSorter = numericSorter<IProduct>(
  (p) => p.prices[0].price,
  "desc"
);

export const oldestSorter = numericSorter<IProduct>(
  (p) => +new Date(p.created_at),
  "asc"
);

export const latestSorter = numericSorter<IProduct>(
  (p) => +new Date(p.created_at),
  "desc"
);

export const PRODUCT_SORTERS = {
  price_low: priceLowSorter,
  price_high: priceHighSorter,
  oldest: oldestSorter,
  latest: latestSorter,
};
