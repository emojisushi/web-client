import styled from "styled-components";
import media from "~common/custom-media";
import { prop } from "styled-tools";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 192px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background-color: ${({ theme }) => theme.colors.canvas.inset2};
  box-shadow: ${({ theme }) => theme.shadows.canvasInset2Shadow};
  margin: 4px;
  padding 4px 1px;  
  ${media.lessThan("tablet")`
    width: 100%;
  `}
`;

const Description = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
`;
const Name = styled.div`
  margin-top: 2px;
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
  width: 160px;
  height: 160px;
  margin: 0 auto;
  cursor: pointer;

  ${media.lessThan("tablet")`
    width: 160px;
    height: 160px;
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

export {
  Wrapper,
  Description,
  Footer,
  Name,
  Image,
  Weight,
  WeightTooltipMarker,
};
