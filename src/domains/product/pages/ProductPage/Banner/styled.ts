import styled from "styled-components";
import media from "src/common/custom-media";

const Slide = styled.div<{
  $imageSrc: string;
}>`
  background-image: url("${(props) => props.$imageSrc}");
  background-size: cover;
  background-position: center;
  inset: 0;
  position: absolute;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  }
`;

const ThumbsContainer = styled.div`
  position: absolute;
  left: 50%;
  display: flex;
  transform-origin: center;
  transform: translateX(-50%);
  bottom: -30px;
  max-width: 75px;
  .use-spring-carousel-thumbs-wrapper {
    column-gap: 5px;
    overflow: hidden !important;
  }
`;

const Dot = styled.div<{
  $isActive: boolean;
}>`
  overflow: hidden;

  border-radius: 100%;
  cursor: pointer;
  width: 10px;
  height: 10px;
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.brand : theme.colors.canvas.inset4};
`;

const NextSlideBtn = styled.div`
  width: 60px;
  opacity: 0;
  position: absolute;
  height: 100%;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.1s;

  ${media.lessThan("tablet")`
    width: 40px;
  `};
`;

const PrevSlideBtn = styled.div`
  width: 60px;
  position: absolute;
  opacity: 0;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.1s;

  ${media.lessThan("tablet")`
    width: 40px;
  `};
`;

const NextSlideBtnOverlay = styled.div`
  width: 60px;
  background: black;
  position: absolute;
  height: 100%;
  opacity: 0;
  top: 0;
  right: 0;
  cursor: pointer;
  transition: 0.1s;

  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.default};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.default};

  ${media.lessThan("tablet")`
    width: 40px;
  `};
`;

const PrevSlideBtnOverlay = styled.div`
  width: 60px;
  background: black;
  opacity: 0;
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
  transition: 0.1s;

  border-top-left-radius: ${({ theme }) => theme.borderRadius.default};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.default};

  ${media.lessThan("tablet")`
    width: 40px;
  `};
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 130px;
  ${media.greaterThan("tablet")`
    height: 180px;
  `};

  ${media.greaterThan("pc")`
    height: 236px;
  `};

  &:hover {
    ${NextSlideBtnOverlay} {
      opacity: 0.5;
    }
    ${PrevSlideBtnOverlay} {
      opacity: 0.5;
    }
    ${NextSlideBtn} {
      opacity: 1;
    }
    ${PrevSlideBtn} {
      opacity: 1;
    }
  }
`;

export {
  Container,
  Slide,
  ThumbsContainer,
  Dot,
  NextSlideBtn,
  PrevSlideBtn,
  NextSlideBtnOverlay,
  PrevSlideBtnOverlay,
};
