import { Heading, CheckCircleSvg, SvgIcon, Container } from "~components";
import * as S from "./styled";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { Page } from "~components/Page";
import { useTypedSearchParams } from "react-router-typesafe-routes/dom";
import { ROUTES } from "~routes";

// todo: don't prompt the user to choose a city
export const ThankYouPage = () => {
  const { t } = useTranslation();
  const [{ order_id }] = useTypedSearchParams(ROUTES.THANKYOU);
  const theme = useTheme();

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
          </Heading>
          <SvgIcon color={theme.colors.brand} style={{ width: "60px" }}>
            <CheckCircleSvg />
          </SvgIcon>
          <S.Text>{t("thankYou.text")}</S.Text>
        </S.Center>
      </Container>
    </Page>
  );
};

export const Component = ThankYouPage;

Object.assign(Component, {
  displayName: "LazyThankYouPage",
});
