import { client } from "~clients/client";
import {
  ISpot,
  IGetCitiesParams,
  IGetCitiesRes,
  ICity,
} from "./access.api.types";
import { IMeta } from "../common/common.api.types";
import { AxiosAuthRefreshRequestConfig } from "axios-auth-refresh";

const getCitiesDefaults: IGetCitiesParams = {
  includeSpots: false,
};

function getSpots(params = {}) {
  return client
    .get<{
      data: ISpot[];
      meta: IMeta;
    }>("spots", {
      params,
      skipAuthRefresh: true,
    } as AxiosAuthRefreshRequestConfig)
    .then((res) => res.data);
}

function getSpot(params: { slug_or_id: string | number }) {
  return client.get<ISpot>("spot", {
    params,
    skipAuthRefresh: true,
  } as AxiosAuthRefreshRequestConfig);
}

function getMainSpot() {
  return client.get<ISpot>("spot-main", {
    skipAuthRefresh: true,
  } as AxiosAuthRefreshRequestConfig);
}

function getCity(params: { slug_or_id: string | number }) {
  return client.get<ICity>("city", {
    params,
    skipAuthRefresh: true,
  } as AxiosAuthRefreshRequestConfig);
}

function getCities(params: IGetCitiesParams = getCitiesDefaults) {
  return client
    .get<IGetCitiesRes>("cities", {
      params,
      skipAuthRefresh: true,
    } as AxiosAuthRefreshRequestConfig)
    .then((res) => res.data);
}

export const accessApi = {
  getSpots,
  getCities,
  getSpot,
  getCity,
  getMainSpot,
};
