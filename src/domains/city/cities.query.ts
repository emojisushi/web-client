import { QueryOptions } from "@tanstack/react-query";
import { ICity, IGetCitiesRes } from "@layerok/emojisushi-js-sdk";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";

export const citiesQuery: QueryOptions<IGetCitiesRes> = {
  queryFn: () =>
    EmojisushiAgent.getCities({
      includeSpots: true,
      includeDistricts: true,
    }),
  queryKey: ["cities", "list", "all"],
};

export const mainCityQuery = ({
  slug_or_id,
}: {
  slug_or_id: string;
}): QueryOptions<ICity> => ({
  queryKey: ["main-city"],
  queryFn: async () => {
    const response = await EmojisushiAgent.getCity({
      slug_or_id,
    });

    return response.data;
  },
});
