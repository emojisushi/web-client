import styled, { keyframes } from "styled-components";
import media from "~common/custom-media";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
  background-color: ${({ theme }) => theme.colors.canvas.default};
  z-index: ${({ theme }) => theme.zIndices.preloader};
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn};
  animation-delay: 400ms;
  animation-timing-function: ease;
  animation-iteration-count: 1;
  animation-duration: 600ms;
  animation-fill-mode: forwards;
`;

const ImageWrapper = styled.div`
  width: 350px;
  ${media.greaterThan("mobile")`
    width: 540px;
  `}
`;

export { Container, ImageWrapper };
