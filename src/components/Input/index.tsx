import * as S from "./styled";
import React, { CSSProperties, forwardRef, ReactNode, useContext } from "react";
import { AsteriskSvg, SvgIcon, SkeletonWrap } from "~components";
import styled, { ThemeContext } from "styled-components";
import clsx from "clsx";

export type IInputComponentProps = React.HTMLProps<HTMLInputElement> & {
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
  name?: string;
  placeholder?: string;
  required?: boolean;
  light?: boolean;
  width?: string;
  error?: string | null;
  label?: string;
  loading?: boolean;
  style?: CSSProperties;
};

const classNamespace = "Emojisushi";

export const inputClasses = {
  root: `${classNamespace}-Input--root`,
  input: `${classNamespace}-Input--input`,
};

export const Input = forwardRef<HTMLInputElement, IInputComponentProps>(
  (props, ref) => {
    const {
      placeholder,
      required,
      endAdornment,
      startAdornment,
      name,
      light = false,
      width,
      label = "",
      error = null,
      className,
      style = {},
      loading = false,
      as,
      ...rest
    } = props;
    const theme = useContext(ThemeContext);
    return (
      <SkeletonWrap
        style={{
          width: "100%",
        }}
        loading={loading}
        borderRadius={10}
      >
        <S.Wrapper className={clsx(inputClasses.root, className)} style={style}>
          {!!label && <StyledLabel>{label}</StyledLabel>}
          <div
            style={{
              position: "relative",
            }}
          >
            {startAdornment}
            <S.Input
              title={placeholder}
              hasEndAdornment={!!endAdornment}
              name={name}
              width={width}
              placeholder={placeholder}
              light={light}
              className={clsx(inputClasses.input)}
              {...rest}
              ref={ref}
            />
            {endAdornment}
            {required && (
              <S.Asterisk>
                <SvgIcon width={"10px"} color={theme.colors.brand}>
                  <AsteriskSvg />
                </SvgIcon>
              </S.Asterisk>
            )}
            {!!error && <S.Error>{error}</S.Error>}
          </div>
        </S.Wrapper>
      </SkeletonWrap>
    );
  }
);

const StyledLabel = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.fg.muted};
  margin-bottom: 5px;
`;
