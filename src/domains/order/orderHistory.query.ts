import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { QueryOptions } from "@tanstack/react-query";
import {
  IGetOrderHistoryRes,
  IOrderHistoryItem,
} from "@layerok/emojisushi-js-sdk";

export const orderHistoryQuery: QueryOptions<IGetOrderHistoryRes> = {
  queryKey: ["orderHistory"],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getOrderHistory(undefined, {
        signal,
      })
    ).data;
  },
};

export const orderHistoryItemQuery = (
  transactionId: string
): QueryOptions<IOrderHistoryItem> => ({
  queryKey: ["orderHistoryItem", transactionId],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getOrderHistoryItem(
        { order_id: transactionId },
        {
          signal,
        }
      )
    ).data;
  },
});
