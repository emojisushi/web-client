import styled from "styled-components";
import media from "src/common/custom-media";

const Heading = styled.p`
  font-weight: 600;
  font-size: 25px;
  line-height: 30px;

  color: ${({ theme }) => theme.colors.fg.default};
`;

export const IconWrapper = styled.div`
  display: flex;
  ${media.lessThan("pc")`
    margin-bottom: 10px;
  `}
`;

const AddressWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  :first-child {
    margin-top: 30px;
  }
  ${media.lessThan("pc")`
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    :first-child {
    margin-top: 20px;
  `}
`;
const ButtonWrapper = styled.div`
  margin-top: 30px;
`;

export { Heading, AddressWrapper, ButtonWrapper };
