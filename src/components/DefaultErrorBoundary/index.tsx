import { useTranslation } from "react-i18next";
import { useLocation, useRouteError } from "react-router-dom";
import { Container } from "~components/Container";
import { useEffect } from "react";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { appConfig } from "~config/app";

export const DefaultErrorBoundary = () => {
  const error = useRouteError();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }
    if (!(error instanceof Error)) {
      return;
    }
    const ignoreErrors = ["queueMicrotask is not defined"]; // @floating-ui uses queueMicrotask
    if (ignoreErrors.some((pattern) => pattern.includes(error.message))) {
      return;
    }
    EmojisushiAgent.log(
      {
        location: location,
        error: error.message,
        stack: error.stack,
      },
      appConfig.version
    );
  }, [error]);

  let title = t("error-boundary.title");
  let subtitle = t("error-boundary.subtitle");

  if (!navigator.onLine) {
    title = t("internetConnectionLost.title");
    subtitle = t("internetConnectionLost.subtitle");
  }

  return (
    <Container>
      <div>
        <h2 style={{ marginTop: 16 }}>{title}</h2>
        <p style={{ marginTop: 4 }}>{subtitle}</p>
      </div>
    </Container>
  );
};
