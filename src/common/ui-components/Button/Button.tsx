import { SkeletonWrap, SpinnerSvg, SvgIcon } from "~components";
import {
  forwardRef,
  PropsWithChildren,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import styled, { DefaultTheme } from "styled-components";

type ButtonSkin = "default" | "danger" | "grey";

type IButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    showSkeleton?: boolean;
    loading?: boolean;
    skin?: ButtonSkin;
    filled?: boolean;
    startAdornment?: ReactNode;
  }
>;

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  (props, ref) => {
    const {
      children,
      filled = false,
      startAdornment,
      showSkeleton = false,
      skin = "default",
      loading = false,
      ...rest
    } = props;

    return (
      <SkeletonWrap loading={showSkeleton}>
        <BaseButton
          $filled={filled}
          $skin={skin}
          $loading={loading}
          {...rest}
          ref={ref}
        >
          {loading ? (
            <SvgIcon width={"25px"} color={"black"}>
              <SpinnerSvg />
            </SvgIcon>
          ) : (
            <>
              {startAdornment}
              <Inner>{children}</Inner>
            </>
          )}
        </BaseButton>
      </SkeletonWrap>
    );
  }
);

const getColor = ({
  theme,
  $skin,
  $filled,
}: {
  theme: DefaultTheme;
  $loading: boolean;
  $filled: boolean;
  $skin: ButtonSkin;
}) => {
  if ($skin === "grey") {
    return theme.colors.fg.default;
  }
  if ($skin === "danger") {
    return $filled ? "white" : "white";
  }
  return $filled ? "black" : theme.colors.brand;
};

const getBorderColor = ({
  $skin,
  theme,
}: {
  theme: DefaultTheme;
  $loading: boolean;
  $filled: boolean;
  $skin: ButtonSkin;
}) => {
  if ($skin === "grey") {
    return "transparent";
  }
  if ($skin === "danger") {
    return theme.colors.red[500];
  }
  return theme.colors.brand;
};

const getHoverBorderColor = ({
  $skin,
  theme,
}: {
  theme: DefaultTheme;
  $loading: boolean;
  $filled: boolean;
  $skin: ButtonSkin;
}) => {
  if ($skin === "grey") {
    return theme.colors.brand;
  }
  if ($skin === "danger") {
    return theme.colors.red[500];
  }
  return theme.colors.brand;
};

const getBackgroundColor = ({
  $skin,
  theme,
  $loading,
  $filled,
}: {
  theme: DefaultTheme;
  $loading: boolean;
  $filled: boolean;
  $skin: ButtonSkin;
}) => {
  if ($skin === "grey") {
    return theme.colors.canvas.inset4;
  }
  if ($skin === "danger") {
    return $loading || $filled ? theme.colors.red[500] : "transparent";
  }
  return $loading || $filled ? theme.colors.brand : "transparent";
};

const getHoverBackgroundColor = ({
  $skin,
  theme,
  $loading,
  $filled,
}: {
  theme: DefaultTheme;
  $loading: boolean;
  $filled: boolean;
  $skin: ButtonSkin;
}) => {
  if ($skin === "grey") {
    return theme.colors.canvas.inset4;
  }
  if ($skin === "danger") {
    return theme.colors.red[500];
  }
  return theme.colors.brand;
};

const getHoverShadow = ({
  $skin,
  theme,
  $loading,
  $filled,
}: {
  theme: DefaultTheme;
  $loading: boolean;
  $filled: boolean;
  $skin: ButtonSkin;
}) => {
  if ($skin === "grey") {
    return theme.shadows.brandSofter;
  }
  if ($skin === "danger") {
    return "none";
  }
  return theme.shadows.brandSofter;
};

const getHoverColor = ({
  $skin,
  theme,
  $loading,
  $filled,
}: {
  theme: DefaultTheme;
  $loading: boolean;
  $filled: boolean;
  $skin: ButtonSkin;
}) => {
  if ($skin === "grey") {
    return theme.colors.brand;
  }
  if ($skin === "danger") {
    return "white";
  }
  return "black";
};

const Inner = styled.div({
  flexShrink: 0,
  height: "100%",
  flexGrow: 1,
  justifyContent: "center",
  display: "flex",
  alignItems: "center",
});

const BaseButton = styled.button<{
  $loading: boolean;
  $filled: boolean;
  $skin: ButtonSkin;
}>`
  border: ${(props) => `1px solid ${getBorderColor(props)}`};
  border-radius: ${({ theme }) => theme.borderRadius.smooth};
  padding: 7px 31px;
  min-width: 130px;
  height: 40px;
  color: ${getColor};
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  text-decoration: none;
  background-color: ${getBackgroundColor};

  :hover {
    border: 1px solid ${getHoverBorderColor};
    background: ${getHoverBackgroundColor};
    box-shadow: ${getHoverShadow};
    color: ${getHoverColor};
  }
`;
