import styled from "styled-components";
import { flexbox, FlexboxProps } from "styled-system";
import { PropsWithChildren } from "react";

export const FlexBox = styled.div<PropsWithChildren<FlexboxProps>>`
  display: flex;
  ${flexbox}
`;
