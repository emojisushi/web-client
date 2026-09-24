import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { QueryOptions } from "@tanstack/react-query";
import { IGetOrderStatusRes } from "@layerok/emojisushi-js-sdk";

export const orderStatusQuery = (
  order_id: string
): QueryOptions<IGetOrderStatusRes> => ({
  queryKey: ["orderStatus", order_id],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getOrderStatus(
        { order_id },
        {
          signal,
        }
      )
    ).data;
  },
});
