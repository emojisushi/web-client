import { getClientAppVersion } from "~components/AppVersionChecker";

export type WorkingHours = [[number, number], [number, number]];

export const appConfig = {
  // todo: extract working hours to a remote config
  workingHours: [
    [10, 0],
    [21, 45],
  ] as WorkingHours,
  version: getClientAppVersion(),
};
