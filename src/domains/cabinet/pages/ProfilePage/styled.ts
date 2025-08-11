import styled from "styled-components";
import media from "src/common/custom-media";

const BtnGroup = styled.div`
  display: flex;
  margin-top: 15px;
  ${media.lessThan("pc")`
    display: flex;
    flex-direction: column;
    
  `}
`;

const BtnWrapper = styled.div`
  margin-left: 20px;
  ${media.lessThan("pc")`
    margin-left: 0;
    margin-top: 20px;   
    
  `}
`;

const Properties = styled.div`
  width: 634px;

  background: ${({ theme }) => theme.colors.canvas.inset2};
  box-shadow: ${({ theme }) => theme.shadows.canvasInset2Shadow};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  margin-top: 20px;
  padding: 15px;
  display: flex;
  flex-direction: column;

  ${media.lessThan("pc")`
    width: 350px;
   
  `}
`;

const Property = styled.div`
  display: flex;
  line-height: 18px;
  font-size: 15px;
  padding-top: 10px;
  :first-child {
    padding-top: 0;
  }
`;

const PropertyLabel = styled.div`
  color: ${({ theme }) => theme.colors.fg.muted};
  width: 270px;
  flex-shrink: 0;
  ${media.lessThan("pc")`
    width: 175px;
    
  `}
`;

const PropertyValue = styled.div`
  color: ${({ theme }) => theme.colors.fg.default};
  word-break: break-all;
`;

const Birth = styled.div`
  margin-top: 30px;
`;

const BirthHeading = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.fg.default};
`;

const BirthLabel = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;

  color: ${({ theme }) => theme.colors.fg.muted};
`;

const BirthProperties = styled.div`
  display: flex;
`;

const BirthProperty = styled.div`
  margin-left: 35px;
  margin-top: 20px;
  :first-child {
    margin-left: 0;
  }
  ${media.lessThan("pc")`
   margin-left: 19px;
  `}
`;

const Sex = styled.div`
  margin-top: 20px;
`;
const SexLabel = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;

  color: ${({ theme }) => theme.colors.fg.muted};
`;

const HorizontalBar = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border.darker};
  margin-top: 30px;
`;

export {
  Properties,
  BtnGroup,
  BtnWrapper,
  Sex,
  SexLabel,
  HorizontalBar,
  Property,
  BirthProperty,
  BirthProperties,
  BirthLabel,
  BirthHeading,
  Birth,
  PropertyLabel,
  PropertyValue,
};
