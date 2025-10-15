import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { QueryOptions } from "@tanstack/react-query";
import { IGetAddressesRes } from "@layerok/emojisushi-js-sdk";

export const addressQuery = (slug: string): QueryOptions<IGetAddressesRes> => ({
  queryKey: ["addresses", slug],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getAddresses(
        { city_slug: slug },
        {
          signal,
        }
      )
    ).data;
  },
});
