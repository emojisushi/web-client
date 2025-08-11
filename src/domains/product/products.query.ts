import {
  IGetProductsParams,
  IGetProductsRes,
} from "@layerok/emojisushi-js-sdk";
import { QueryOptions } from "@tanstack/react-query";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";

export const productsQueryKeys = {
  def: ["products"],
  lists: () => [...productsQueryKeys.def, "list"],
  list: (params?: IGetProductsParams) => [
    ...productsQueryKeys.lists(),
    params ?? "all",
  ],
};

export const DEFAULT_PRODUCTS_LIMIT = 9999;

export const PRODUCT_ID_SEARCH_QUERY_PARAM = "product_id";

export const productsQuery = (
  params: IGetProductsParams = {}
): QueryOptions<IGetProductsRes> => {
  const { search, ...restParams } = params;
  return {
    queryKey: productsQueryKeys.list(restParams),
    queryFn: async ({ signal }) => {
      const res = await EmojisushiAgent.getProducts(restParams, {
        signal,
      });
      return res.data;
    },
  };
};
