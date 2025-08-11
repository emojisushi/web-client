import {
  IGetCategoriesParams,
  IGetCategoriesRes,
} from "@layerok/emojisushi-js-sdk";
import { QueryOptions } from "@tanstack/react-query";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";

export const categoriesQuery = (
  params: IGetCategoriesParams = {}
): QueryOptions<IGetCategoriesRes> => ({
  queryKey: ["categories", "list", params],
  queryFn: () => EmojisushiAgent.getCategories(params).then((res) => res.data),
});
