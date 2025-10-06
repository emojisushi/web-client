import { getClientAppVersion } from "~components/AppVersionChecker";

export type WorkingHours = [[number, number], [number, number]];

export const appConfig = {
  // todo: extract working hours to a remote config
  workingHours: [
    [0, 1],
    [24, 0],
  ] as WorkingHours,
  version: getClientAppVersion(),
};
