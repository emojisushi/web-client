import styled from "styled-components";
import media from "~common/custom-media";

const DeliveryText = styled.p`
  font-size: 15px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.fg.default};
  margin-top: 10px;
  width: 100%;
  ${media.lessThan("pc")`
        width: 100%;
        margin-top: 30px;
        margin-bottom: 30px;
    `}
`;

const AdresText = styled.p`
  font-size: 15px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.fg.default};
  margin-top: 10px;
  width: 100%;

  ${media.greaterThan("tablet")`
        width: 500px;
    `}

  ${media.greaterThan("pc")`
        width: 700px;
        margin-top: 15px;   
    `}
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${media.greaterThan("pc")`
        width: 500px;
    `}
`;

const Right = styled.div`
  ${media.greaterThan("pc")`
        width: 540px;
    `}
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  ${media.lessThan("pc")`
        flex-direction: column;
    `}
`;
const HeadingWrapper = styled.div`
  margin-bottom: 20px;
  ${media.lessThan("pc")`
        margin-bottom: 0;
    `}
`;

export { DeliveryText, Left, Right, FlexContainer, HeadingWrapper, AdresText };
