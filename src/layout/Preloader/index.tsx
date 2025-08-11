import * as S from "./styled";
import { SvgIcon, LogoSvg } from "~components";
import FadeLoader from "react-spinners/FadeLoader";
import { useTheme } from "styled-components";

export const Preloader = () => {
  const override = {
    position: "absolute",
    left: "50%",
    top: "50%",
  };
  const theme = useTheme();
  return (
    <S.Container>
      <S.ImageWrapper>
        <SvgIcon color={"white"} width={"100%"} style={{ opacity: 0.05 }}>
          <LogoSvg />
        </SvgIcon>
      </S.ImageWrapper>

      <FadeLoader
        color={theme.colors.brand}
        width={2}
        height={12}
        margin={10}
        loading={true}
        // @ts-ignore
        css={override}
      />
    </S.Container>
  );
};
