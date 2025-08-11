import { QueryOptions } from "@tanstack/react-query";
import { ISpot } from "@layerok/emojisushi-js-sdk";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";

export const spotQuery = (slugOrId: string): QueryOptions<ISpot> => {
  return {
    queryFn: () =>
      EmojisushiAgent.getSpot({
        slug_or_id: slugOrId,
      }).then((res) => res.data),
    queryKey: ["city", slugOrId],
  };
};
