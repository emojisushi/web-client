import { APP_VERSION_STORAGE_KEY } from "~components/AppVersionChecker";

const getClientAppVersion = () => localStorage.getItem(APP_VERSION_STORAGE_KEY);

export const useClientAppVersion = () => {
  return getClientAppVersion();
};
