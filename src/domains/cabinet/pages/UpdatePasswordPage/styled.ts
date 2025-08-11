import styled from "styled-components";
import media from "~common/custom-media";

const Heading = styled.p`
  font-weight: 600;
  font-size: 25px;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.fg.default};
`;

const Container = styled.div`
  margin-top: 12px;
  width: 285px;
  ${media.lessThan("tablet")`
    width: 350px;
  `}
`;

const Text = styled.p`
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.fg.muted};
  margin-top: 20px;
  margin-bottom: 5px;
  :first-child {
    margin-top: 0;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
`;

export { Heading, Container, Text, ButtonWrapper };
