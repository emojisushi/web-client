import styled from "styled-components";
import { CSSProperties } from "react";

const Parent = styled.span<{
  $color?: CSSProperties["color"];
  hoverColor?: CSSProperties["color"];
}>`
  display: flex;
  svg {
    height: auto;
    width: 100%;
  }

  :hover {
    ${({ hoverColor }) => (hoverColor ? `color: ${hoverColor}` : "")};
  }

  ${({ $color }) => ($color ? `color: ${$color}` : "")};
`;

export { Parent };
