import * as S from "./styled";
import { ChangeEvent } from "react";

type BonusAmountInputProps = {
  value: string;
  max: number;
  suffix: string;
  maxLabel: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMax: () => void;
};

export const BonusAmountInput = ({
  value,
  max,
  suffix,
  maxLabel,
  error,
  onChange,
  onMax,
}: BonusAmountInputProps) => {
  return (
    <div>
      <S.Wrapper>
        <S.InputRow>
          <S.Input
            type="number"
            inputMode="numeric"
            min={0}
            max={max}
            value={value}
            onChange={onChange}
          />
          <S.Suffix>{suffix}</S.Suffix>
        </S.InputRow>
        <S.MaxButton type="button" disabled={max <= 0} onClick={onMax}>
          {maxLabel}
        </S.MaxButton>
      </S.Wrapper>
      {!!error && <S.Error>{error}</S.Error>}
    </div>
  );
};
