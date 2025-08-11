import { Container, Heading } from "~components";
import * as S from "./styled";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { DefaultErrorBoundary } from "~components/DefaultErrorBoundary";
import { Page } from "~components/Page";
import { useCurrentCitySlug } from "~domains/city/hooks/useCurrentCitySlug";
import { useQuery } from "@tanstack/react-query";
import { citiesQuery } from "~domains/city/cities.query";
import { useShowBinotel } from "~hooks/use-binotel";

export const DeliveryPage = observer(() => {
  const { t } = useTranslation();
  useShowBinotel();

  const citySlug = useCurrentCitySlug();
  const { data: cities, isLoading: isCitiesLoading } = useQuery(citiesQuery);
  const city = (cities?.data || []).find((c) => c.slug === citySlug);

  return (
    <Page>
      <Container>
        <S.FlexContainer>
          <S.Left>
            <S.HeadingWrapper>
              <Heading
                style={{
                  fontWeight: "600",
                }}
              >
                {t("delivery-and-payment.title")}
              </Heading>
            </S.HeadingWrapper>

            {/*<S.AdresText>*/}
            {/*  <b>{t("common.address")}</b>: {city.address}*/}
            {/*</S.AdresText>*/}

            <S.DeliveryText
              dangerouslySetInnerHTML={{ __html: city?.html_content }}
            />
          </S.Left>
          {!!city?.google_map_url && (
            <S.Right>
              <iframe src={city.google_map_url} width="100%" height="480" />
            </S.Right>
          )}
        </S.FlexContainer>
      </Container>
    </Page>
  );
});

export const Component = DeliveryPage;

export const ErrorBoundary = DefaultErrorBoundary;

Object.assign({
  displayName: "LazyDeliveryPage",
});
