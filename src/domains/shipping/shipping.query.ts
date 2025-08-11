import { QueryOptions } from "@tanstack/react-query";
import { IGetShippingMethodsRes } from "@layerok/emojisushi-js-sdk";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";

export const shippingQuery: QueryOptions<IGetShippingMethodsRes> = {
  queryFn: () => EmojisushiAgent.getShippingMethods().then((res) => res.data),
  queryKey: ["shipping", "list", "all"],
};
