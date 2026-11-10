import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { QueryOptions } from "@tanstack/react-query";
import { IPosterPromotion } from "@layerok/emojisushi-js-sdk";

// Poster promotions the backend applies to orders right now (e.g. 2+1 pizzas).
export const posterPromotionsQuery: QueryOptions<IPosterPromotion[]> = {
  queryKey: ["poster-promotions"],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getPosterPromotions(undefined, {
        signal,
      })
    ).data.data;
  },
};
