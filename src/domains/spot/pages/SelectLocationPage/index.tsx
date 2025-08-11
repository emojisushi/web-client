import * as S from "./styled";
import { MapPinSvg, LogoSvg, SvgIcon } from "~components";
import { useTranslation } from "react-i18next";
import { Cities, CitiesSkeleton } from "./components/City";
import { citiesQuery } from "~domains/city/cities.query";
import { useQuery } from "@tanstack/react-query";

export const SelectLocationPage = () => {
  const { t } = useTranslation();
  const { data: cities, isLoading } = useQuery(citiesQuery);

  return (
    <S.Locations>
      <S.LocationsContainer>
        <S.LocationsHead>
          <S.LogoWrapper>
            <SvgIcon width={"100%"}>
              <LogoSvg />
            </SvgIcon>
          </S.LogoWrapper>

          <S.LocationsLabel>
            {t("locationsModal.title")}
            <S.MapWrapper>
              <SvgIcon width={"100%"} color={"white"}>
                <MapPinSvg />
              </SvgIcon>
            </S.MapWrapper>
          </S.LocationsLabel>
        </S.LocationsHead>
        <S.LocationsBody>
          {isLoading ? <CitiesSkeleton /> : <Cities items={cities.data} />}
        </S.LocationsBody>
      </S.LocationsContainer>
    </S.Locations>
  );
};

export const Component = SelectLocationPage;

Object.assign(Component, {
  displayName: "LazySelectLocationPage",
});
