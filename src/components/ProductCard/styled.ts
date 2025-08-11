import styled from "styled-components";
import media from "~common/custom-media";
import { prop } from "styled-tools";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 255px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background-color: ${({ theme }) => theme.colors.canvas.inset2};
  box-shadow: ${({ theme }) => theme.shadows.canvasInset2Shadow};
  padding: 22px 12px 18px;

  ${media.lessThan("tablet")`
    width: 100%;
    padding: 37px 16px 26px;
  `}
`;

const Description = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Footer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Name = styled.div`
  margin-top: 20px;
  font-size: 15px;
  cursor: pointer;
`;

const Image = styled.div<{
  src: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("${prop("src")}");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 230px;
  height: 230px;
  margin: 0 auto;
  cursor: pointer;

  ${media.lessThan("tablet")`
    width: 260px;
    height: 260px;
  `}
`;

const Weight = styled.div`
  display: flex;
  font-size: 13px;
  cursor: pointer;
  ${media.lessThan("tablet")`
    font-size: 15px;
  `}
`;

const WeightTooltipMarker = styled.span`
  font-size: 12px;
  position: relative;
  top: -3px;
`;

const FavouriteButtonWrapper = styled.div`
  position: absolute;
  top: 22px;
  right: 12px;
  z-index: 1;

  ${media.lessThan("tablet")`
    top: 30px;
    right: 17px;
  `}
`;

const FavouriteButton = styled.div`
  background: rgba(20, 20, 20, 0.7);
  border-radius: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 35px;
  height: 35px;

  ${media.lessThan("tablet")`
    width: 47px;
    height: 47px;
    padding: 7px;
  `}
  padding: 5px;
`;

export {
  Wrapper,
  Description,
  Footer,
  Name,
  Image,
  Weight,
  WeightTooltipMarker,
  FavouriteButton,
  FavouriteButtonWrapper,
};
