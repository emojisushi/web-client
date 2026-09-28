import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { QueryOptions } from "@tanstack/react-query";
import { IPromotion } from "@layerok/emojisushi-js-sdk";

export const promotionsQuery: QueryOptions<IPromotion[]> = {
  queryKey: ["promotions"],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getPromotions(undefined, {
        signal,
      })
    ).data.data;
  },
};
