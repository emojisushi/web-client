import { PropsWithChildren, useEffect } from "react";
import { router } from "~router";
import { ModalIDEnum } from "~common/modal.constants";
import { useModal } from "~modal";
import { getAppVersion } from "src/getAppVersion";
import { persistentThrottle } from "~utils/persistentThrottle";
import { appConfig } from "~config/app";

export const LAST_TIME_VERSION_CHECKED_STORAGE_KEY =
  "last_time_app_version_checked";
export const APP_VERSION_STORAGE_KEY = "app_version";

const CHECK_APP_VERSION_THROTTLE_INTERVAL = 5 * 60 * 1000; // 5 minutes

const getActualAppVersion = () => getAppVersion().then((res) => res.version);
export const getClientAppVersion = () =>
  localStorage.getItem(APP_VERSION_STORAGE_KEY);

export const AppVersionChecker = ({
  children,
  staleTime = CHECK_APP_VERSION_THROTTLE_INTERVAL,
}: PropsWithChildren<{
  staleTime?: number;
}>) => {
  const modal = useModal(ModalIDEnum.OutdatedAppWarning);

  useEffect(() => {
    const checkAppVersion = persistentThrottle(
      () =>
        getActualAppVersion().then((actualAppVersion) => {
          const clientAppVersion = getClientAppVersion();
          if (actualAppVersion !== clientAppVersion) {
            window.require_reload = true;
            localStorage.setItem(APP_VERSION_STORAGE_KEY, actualAppVersion);
            appConfig.version = actualAppVersion;
          }
        }),
      {
        interval: staleTime,
        key: LAST_TIME_VERSION_CHECKED_STORAGE_KEY,
      }
    );

    const unsubscribeRouter = router.subscribe(checkAppVersion);

    return () => {
      unsubscribeRouter();
    };
  }, []);

  useEffect(() => {
    return router.subscribe((state) => {
      if (state.navigation.location) {
        // don't reload during pending navigation
        return;
      }
      if (window.require_reload) {
        //modal.show();

        // forcefully download new version of the application by reloading a browser during page navigation
        window.location.href = state.location.pathname + state.location.search;
      }
    });
  }, []);

  return <>{children}</>;
};
