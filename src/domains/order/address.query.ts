import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { QueryOptions } from "@tanstack/react-query";
import { IGetAddresses } from "@layerok/emojisushi-js-sdk";

export const addressQuery: QueryOptions<IGetAddresses> = {
  queryKey: ["addresses"],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getAddresses(undefined, {
        signal,
      })
    ).data;
  },
};
