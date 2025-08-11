import { QueryOptions } from "@tanstack/react-query";
import { ISpot } from "@layerok/emojisushi-js-sdk";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";

export const spotsQuery = (): QueryOptions<ISpot[]> => {
  return {
    queryFn: () => EmojisushiAgent.getSpots().then((res) => res.data),
    queryKey: ["spots"],
  };
};
