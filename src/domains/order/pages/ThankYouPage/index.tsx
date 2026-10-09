import { Heading, CheckCircleSvg, SvgIcon, Container } from "~components";
import * as S from "./styled";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { Page } from "~components/Page";
import { useTypedSearchParams } from "react-router-typesafe-routes/dom";
import { ROUTES } from "~routes";
import { useClearCart } from "~domains/cart/hooks/use-clear-cart";
import { useCallback, useEffect } from "react";

// todo: don't prompt the user to choose a city
export const ThankYouPage = () => {
  const { t } = useTranslation();
  const { mutate: clearCart } = useClearCart();
  const [{ order_id, online_order, wait_time }] = useTypedSearchParams(
    ROUTES.THANKYOU
  );
  const theme = useTheme();

  const formatMinutes = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    let result = "";
    if (hours === 1) {
      result += `${hours} ${t("checkout.hour")}`;
    } else if (hours > 1) {
      result += `${hours} ${t("checkout.hours")}`;
    }

    if (mins > 0) {
      if (hours > 0) result += " ";
      result += `${mins} ${t("checkout.minutes")}`;
    }
    return result;
  }, []);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <Page>
      <Container>
        <S.Center>
          <Heading
            style={{
              marginBottom: "20px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {!!order_id
              ? t("thankYou.subtitle", {
                  id: order_id,
                })
              : t("thankYou.subtitleWithoutId")}
            <br />
            <br />
            {!!wait_time && wait_time > 0 && (
              <span>
                {t("checkout.wait_time")} {formatMinutes(wait_time)}
              </span>
            )}
          </Heading>
          <SvgIcon color={theme.colors.brand} style={{ width: "60px" }}>
            <CheckCircleSvg />
          </SvgIcon>
          <S.Text>
            {online_order ? t("thankYou.onlineOrderText") : t("thankYou.text")}
          </S.Text>
        </S.Center>
      </Container>
    </Page>
  );
};

export const Component = ThankYouPage;

Object.assign(Component, {
  displayName: "LazyThankYouPage",
});
