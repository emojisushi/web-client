import styled, { ThemeContext } from "styled-components";
import FadeLoader from "react-spinners/FadeLoader";
import { useContext } from "react";

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.canvas.default};
  opacity: 0.7;
  z-index: ${({ theme }) => theme.zIndices.preloader};
`;
const override = {
  position: "absolute",
  left: "50%",
  top: "50%",
};

export const Loader = ({ loading }) => {
  const theme = useContext(ThemeContext);
  return (
    loading && (
      <Overlay>
        <FadeLoader
          color={theme.colors.brand}
          width={2}
          height={12}
          margin={10}
          loading={true}
          // @ts-ignore
          css={override}
        />
      </Overlay>
    )
  );
};
