import { CaretDownSvg, FlexBox, SvgIcon } from "~components";
import MapLocationPinSrc from "~assets/ui-icons/map-location-pin.svg";
import * as S from "./styled";

export const LocationDropdownTrigger = ({ title }: { title: string }) => {
  return (
    <S.Container>
      <FlexBox alignItems={"center"}>
        <S.Icon>
          <img src={MapLocationPinSrc} alt="location picker" />
        </S.Icon>
        <S.Label>{title}</S.Label>
      </FlexBox>

      <S.CaretDown>
        <SvgIcon color={"white"} width={"10px"}>
          <CaretDownSvg />
        </SvgIcon>
      </S.CaretDown>
    </S.Container>
  );
};
