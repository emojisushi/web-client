import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { QueryOptions } from "@tanstack/react-query";
import { IGetCheckoutFormRes } from "@layerok/emojisushi-js-sdk";

export const checkoutFormQuery: QueryOptions<IGetCheckoutFormRes> = {
  queryKey: ["checkoutForm"],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getCheckoutForm(undefined, {
        signal,
      })
    ).data;
  },
};
