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
      <S.Checkbox
        type="checkbox"
        name={name}
        onChange={onChange}
        checked={checked}
      />
      <S.LabelCheckbox>
        {checked && (
          <SvgIcon style={{ cursor: "pointer" }} width={"17px"} height={"12px"}>
            <CheckSvg />
          </SvgIcon>
        )}
      </S.LabelCheckbox>
      <S.Text style={{ fontSize: "unset" }}>{children}</S.Text>

      {!!error && <S.Error>{error}</S.Error>}
    </S.LabelCheck>
  );
};
