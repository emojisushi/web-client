import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { QueryOptions } from "@tanstack/react-query";
import { IGetCatalogRes } from "@layerok/emojisushi-js-sdk";

export const catalogQuery: QueryOptions<IGetCatalogRes> = {
  queryKey: ["catalog"],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getCatalog(undefined, {
        signal,
      })
    ).data;
  },
};
