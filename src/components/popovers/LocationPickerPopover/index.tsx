import * as S from "./styled";
import { SvgIcon, CaretDownSvg, FlexBox, DropdownPopover } from "~components";
import MapLocationPinSrc from "~assets/ui/icons/map-location-pin.svg";
import Skeleton from "react-loading-skeleton";
import { ICity, ISpot } from "~api/types";
import { observer } from "mobx-react";
import { appStore } from "~stores/appStore";
import { useLocation } from "react-router-dom";

type LocationPickerPopoverProps = {
  offset?: number;
  backgroundColor?: string;
  width?: string;
  loading?: boolean;
  spots?: ISpot[];
};

export const LocationPickerPopover = observer(
  ({
    offset = 0,
    backgroundColor = "#171717",
    width = "211px",
    spots = [],
    loading,
  }: LocationPickerPopoverProps) => {
    const location = useLocation();
    const options = spots.map((spot) => ({
      id: spot.slug,
      name: spot.name,
      url: spot.frontend_url,
    }));

    const selectedOption = options.find(
      (option) => option.id === appStore.spot.slug
    );
    const selectedIndex = options.indexOf(selectedOption);
    if (loading) {
      return <Skeleton width={width} height={40} />;
    }
    return (
      <DropdownPopover
        backgroundColor={backgroundColor}
        width={width}
        offset={offset}
        options={options}
        selectedIndex={selectedIndex}
        onSelect={({ close, option, index }) => {
          window.location.href = option.url + location.pathname;

          close();
        }}
      >
        {({ selectedOption }) => (
          <S.Container>
            <FlexBox alignItems={"center"}>
              <S.Icon>
                <img src={MapLocationPinSrc} alt="location picker" />
              </S.Icon>
              <S.Label>{selectedOption.name}</S.Label>
            </FlexBox>

            <S.CaretDown>
              <SvgIcon color={"white"} width={"10px"}>
                <CaretDownSvg />
              </SvgIcon>
            </S.CaretDown>
          </S.Container>
        )}
      </DropdownPopover>
    );
  }
);
