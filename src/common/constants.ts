import { SortKey } from "@layerok/emojisushi-js-sdk";

export const AUTHENTICATED_USER_QUERY_KEY = ["authenticated-user"];

export enum CitySlug {
  Odesa = "odesa",
  Chornomorsk = "chorno",
}

export const LOCATION_CONFIRMED_SEARCH_PARAM = "location_confirmed";

export enum SortModeEnum {
  Default = "default",
  Latest = "latest",
  Oldest = "oldest",
  PriceHigh = "price_high",
  PriceLow = "price_low",
}

export const SORT_MODE_KEYS: SortKey[] = [
  SortModeEnum.Default,
  SortModeEnum.Oldest,
  SortModeEnum.Latest,
  SortModeEnum.PriceHigh,
  SortModeEnum.PriceLow,
];

export const SORT_MODE_SEARCH_PARAM = "sort";
export const SEARCH_QUERY_SEARCH_PARAM = "q";
