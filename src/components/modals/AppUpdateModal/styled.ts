import styled from "styled-components";
import { media } from "~common/custom-media";

const Title = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  margin-top: 15px;
  text-align: center;
`;
const Subtitle = styled.div`
  margin-top: 8px;
  text-align: center;
`;

const Footer = styled.div`
  margin-top: 20px;
`;

const Root = styled.div`
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 338px;
  ${media.lessThan("pc")`
    width: 310px;
  `}
`;

export { Title, Subtitle, Footer, Root };
