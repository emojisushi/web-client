import styled, { css } from "styled-components";
import { prop, ifProp } from "styled-tools";
import { CSSProperties } from "react";

const Button = styled.button<{
  color: CSSProperties["color"];
  hoverColor: CSSProperties["color"];
  padding?: CSSProperties["padding"];
  width?: CSSProperties["width"];
  minWidth?: CSSProperties["minWidth"];
  outline?: boolean;
  hoverOutline?: boolean;
  justifyContent?: CSSProperties["justifyContent"];
  border?: CSSProperties["border"];
  background?: CSSProperties["background"];
  hoverBackgroundColor?: CSSProperties["background"];
  backgroundColor?: CSSProperties["backgroundColor"];
  filled?: boolean;
}>`
  border: ${ifProp("outline", "1px solid #FFE600", "none")};
  border-radius: 10px;
  color: ${prop("color")};
  padding: ${prop("padding", "7px 31px")};
  width: ${prop("width", "130px")};
  min-width: ${prop("minWidth", "130px")};
  height: 40px;
  text-align: center;
  display: flex;
  justify-content: ${prop("justifyContent", "center")};
  align-items: center;
  user-select: none;
  text-decoration: none;
  background-color: ${prop("backgroundColor")};

  ${ifProp(
    "filled",
    css`
      box-shadow: 0px 4px 15px rgba(255, 230, 0, 0.3);
    `
  )}

  :hover {
    border: ${ifProp("hoverOutline", "1px solid #FFE600", "none")};
    background: ${prop("hoverBackgroundColor")};
    box-shadow: 0px 4px 15px rgba(255, 230, 0, 0.3);
    color: ${prop("hoverColor")};
  }
`;

export { Button };
