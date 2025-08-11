import styled from "styled-components";
import { media } from "~common/custom-media";

export const Page = styled.div`
  width: 100%;
  padding-bottom: 50px;
  padding-top: 50px;

  ${media.lessThan("pc")`
    padding-top: 60px;
  `}
  ${media.lessThan("tablet")`
    padding-top: 40px;
  `}
`;
