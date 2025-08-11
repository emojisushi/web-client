import styled from "styled-components";
import media from "~common/custom-media";
import { flexbox, FlexboxProps } from "styled-system";
import { PropsWithChildren } from "react";

export const Container = styled.div<PropsWithChildren<FlexboxProps>>`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  max-width: 1110px;
  margin: 0 auto;
  ${media.lessThan("pc")`
    max-width: 730px;
  `}
  ${media.lessThan("tablet")`
    max-width: 350px;
  `}
  ${flexbox}
`;
