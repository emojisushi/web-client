import { SvgIcon } from "../SvgIcon";
import { MinusSvg } from "~components";
import { PlusSvg } from "~components";
import * as S from "./styled";
import { Button } from "~common/ui-components/Button/Button";
import { FlexBox } from "../FlexBox";
import { MouseEventHandler } from "react";
import { useTheme } from "styled-components";

export const Counter = ({
  count,
  handleIncrement,
  handleDecrement,
  width = "130px",
}: {
  count: number;
  handleIncrement: MouseEventHandler<HTMLSpanElement>;
  handleDecrement: MouseEventHandler<HTMLSpanElement>;
  width?: string;
}) => {
  const theme = useTheme();

  return (
    <Button
      filled
      style={{
        justifyContent: "space-around",
        padding: "0",
        width,
      }}
    >
      <FlexBox
        justifyContent={"center"}
        alignItems={"center"}
        style={{ width: "100%", height: "100%" }}
      >
        <SvgIcon
          width={"45px"}
          height={"100%"}
          onClick={handleDecrement}
          color={"black"}
          style={{
            cursor: "pointer",
            paddingRight: "15px",
            paddingLeft: "5px",
          }}
        >
          <MinusSvg />
        </SvgIcon>
        <S.Count color={"black"} delimiterColor={theme.colors.brandDelimiter}>
          {count}
        </S.Count>
        <SvgIcon
          height={"100%"}
          width={"45px"}
          onClick={handleIncrement}
          color={"black"}
          style={{
            cursor: "pointer",
            paddingLeft: "15px",
            paddingRight: "5px",
          }}
        >
          <PlusSvg />
        </SvgIcon>
      </FlexBox>
    </Button>
  );
};
