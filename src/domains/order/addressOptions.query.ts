import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { QueryOptions } from "@tanstack/react-query";
import { IGetAddressOptions } from "@layerok/emojisushi-js-sdk";

export const addressOptionsQuery: QueryOptions<IGetAddressOptions> = {
  queryKey: ["addressOptions"],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getAddressOptions(undefined, {
        signal,
      })
    ).data;
  },
};
