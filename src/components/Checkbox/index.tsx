import * as S from "./styled";
import { ChangeEvent, ReactNode } from "react";
import { CheckSvg } from "../svg/CheckSvg";
import { SvgIcon } from "../SvgIcon";

export const Checkbox = ({
  children,
  checked,
  name,
  onChange,
  error,
}: {
  children: ReactNode;
  checked: boolean;
  name: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => {
  return (
    <S.LabelCheck>
      <S.Checkbox type="checkbox" name={name} onChange={onChange} />
      <S.LabelCheckbox>
        {checked && (
          <SvgIcon width={"17px"} height={"12px"}>
            <CheckSvg />
          </SvgIcon>
        )}
      </S.LabelCheckbox>
      <S.Text>{children}</S.Text>

      {!!error && <S.Error>{error}</S.Error>}
    </S.LabelCheck>
  );
};
