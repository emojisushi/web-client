import * as S from "./styled";
import { cloneElement, forwardRef, HTMLProps, ReactElement } from "react";

export const SvgButton = forwardRef<
  HTMLDivElement,
  {
    children: ReactElement;
  } & HTMLProps<HTMLDivElement>
>((props, ref) => {
  const { children, as, ...rest } = props;
  return (
    <S.Box {...rest} ref={ref}>
      {cloneElement(children)}
    </S.Box>
  );
});
