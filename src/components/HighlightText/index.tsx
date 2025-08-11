import { ReactElement } from "react";
import * as S from "./styled";

export const HightlightText = ({
  children,
  isActive = false,
}: {
  children: ReactElement;
  isActive?: boolean;
}) => {
  return <S.Container isActive={isActive}>{children}</S.Container>;
};
