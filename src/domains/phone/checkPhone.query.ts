import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { QueryOptions } from "@tanstack/react-query";
import { IGetPhoneRes } from "@layerok/emojisushi-js-sdk";

export const checkPhoneQuery = (phone: string): QueryOptions<IGetPhoneRes> => ({
  queryKey: ["phone", phone],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getPhoneStatus(
        { phone: phone },
        {
          signal,
        }
      )
    ).data;
  },
});
