import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { QueryOptions } from "@tanstack/react-query";
import {
  IGetBonusOptionsRes,
  IGetUserBonusRes,
  IGetUserBonusHistoryRes,
  IGetClientBonusRes,
} from "@layerok/emojisushi-js-sdk";

export const clientBonusQuery = (
  phone: string
): QueryOptions<IGetClientBonusRes> => ({
  queryKey: ["clientBonus", phone],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getClientBonus(
        { phone },
        {
          signal,
        }
      )
    ).data;
  },
});

export const bonusOptionsQuery: QueryOptions<IGetBonusOptionsRes> = {
  queryKey: ["bonusOptions"],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getBonusOptions(undefined, {
        signal,
      })
    ).data;
  },
};

export const userBonusQuery: QueryOptions<IGetUserBonusRes> = {
  queryKey: ["userBonus"],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getUserBonus(undefined, {
        signal,
      })
    ).data;
  },
};

export const userBonusHistoryQuery: QueryOptions<IGetUserBonusHistoryRes> = {
  queryKey: ["userBonusHistory"],
  queryFn: async ({ signal }) => {
    return (
      await EmojisushiAgent.getUserBonusHistory(undefined, {
        signal,
      })
    ).data;
  },
};
