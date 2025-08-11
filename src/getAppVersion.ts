import axios from "axios";

export type GetAppVersionResData = { version: string };
export const getAppVersion = async (): Promise<GetAppVersionResData> => {
  const res = await axios.get("/version.json");
  return res.data;
};
