import { QueryOptions } from "@tanstack/react-query";
import { IGetPaymentMethodsRes } from "@layerok/emojisushi-js-sdk";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";

export const paymentQuery: QueryOptions<IGetPaymentMethodsRes> = {
  queryFn: () => EmojisushiAgent.getPaymentMethods().then((res) => res.data),
  queryKey: ["payment", "list", "all"],
};
