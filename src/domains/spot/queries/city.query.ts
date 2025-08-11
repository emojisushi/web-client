import { QueryOptions } from "@tanstack/react-query";
import { ICity } from "@layerok/emojisushi-js-sdk";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";

export const cityQuery = (slugOrId: string): QueryOptions<ICity> => {
  return {
    queryFn: () =>
      EmojisushiAgent.getCity({
        slug_or_id: slugOrId,
      }).then((res) => res.data),
    queryKey: ["city", slugOrId],
  };
};
