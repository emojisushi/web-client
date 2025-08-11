import React, { MouseEventHandler } from "react";
import { MinusSvg, PlusSvg, SvgIcon } from "~components";
import * as S from "./styled";

const MyCounter = ({
  count = 0,
  handleDecrement,
  handleIncrement,
  min = 0,
  max = Infinity,
}: {
  count: number;
  handleDecrement: MouseEventHandler<HTMLSpanElement>;
  handleIncrement: MouseEventHandler<HTMLSpanElement>;
  min?: number;
  max?: number;
}) => {
  return (
    <S.ButtonWrapper>
      <S.Button onClick={handleDecrement} $disabled={count === min}>
        <SvgIcon width="15px" clickable>
          <MinusSvg />
        </SvgIcon>
      </S.Button>
      <S.Counter>{count}</S.Counter>
      <S.Button onClick={handleIncrement} $disabled={count === max}>
        <SvgIcon width="15px" clickable>
          <PlusSvg />
        </SvgIcon>
      </S.Button>
    </S.ButtonWrapper>
  );
};

export default MyCounter;
