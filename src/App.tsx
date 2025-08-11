import { RouterProvider } from "react-router-dom";
import "normalize.css";
import { theme } from "~theme";
import { ThemeProvider } from "styled-components";
import { Preloader } from "~layout/Preloader";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "~lib/query-client";
import { Suspense } from "react";
import { Loader } from "~components";
import NiceModal from "@ebay/nice-modal-react";
import { I18nextProvider } from "react-i18next";
import i18n from "~lib/react-i18next";
import { router } from "~router";
import { ModalIDEnum } from "~common/modal.constants";
import { AppUpdateModal } from "~components/modals/AppUpdateModal";
import { appConfig } from "~config/app";
import { AppVersionChecker } from "~components/AppVersionChecker";
import { GlobalStyle } from "~components/GlobalStyle/GlobalStyle";
import { createSession, getSession } from "~utils/session.utils";
import { citiesQuery } from "~domains/city/cities.query";
import { useBinotel } from "~hooks/use-binotel";

if (!getSession()) {
  createSession();
}

// prefetch cities
queryClient.fetchQuery(citiesQuery);

console.log("app version", appConfig.version);

export const App = () => {
  useBinotel();
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Suspense fallback={<Loader loading={true} />}>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <SkeletonTheme
              baseColor={theme.colors.skeleton.baseColor}
              highlightColor={theme.colors.skeleton.highlightColor}
            >
              <NiceModal.Provider>
                <AppVersionChecker>
                  <RouterProvider
                    fallbackElement={<Preloader />}
                    router={router}
                  />
                </AppVersionChecker>
                <AppUpdateModal id={ModalIDEnum.OutdatedAppWarning} />
              </NiceModal.Provider>
            </SkeletonTheme>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </I18nextProvider>
      </Suspense>
    </ThemeProvider>
  );
};
