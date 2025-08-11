import { useContext } from "react";
import { ThemeContext } from "styled-components";
import { FlexBox, MinusSvg, PlusSvg, SvgIcon } from "~components";
import * as S from "./styled";

export const Counter = ({ handleDecrement, handleIncrement, count }) => {
  const theme = useContext(ThemeContext);

  return (
    <FlexBox
      justifyContent={"center"}
      alignItems={"center"}
      style={{ width: "118px", height: "100%" }}
    >
      <SvgIcon
        width={"40px"}
        height={"100%"}
        onClick={handleDecrement}
        color={theme.colors.grey[450]}
        hoverColor={theme.colors.brand}
        style={{ cursor: "pointer", paddingRight: "15px" }}
      >
        <MinusSvg />
      </SvgIcon>
      <S.Count color={"white"} delimiterColor={theme.colors.grey[510]}>
        {count}
      </S.Count>
      <SvgIcon
        height={"100%"}
        width={"40px"}
        onClick={handleIncrement}
        color={theme.colors.grey[450]}
        hoverColor={theme.colors.brand}
        style={{ cursor: "pointer", paddingLeft: "15px" }}
      >
        <PlusSvg />
      </SvgIcon>
    </FlexBox>
  );
};
