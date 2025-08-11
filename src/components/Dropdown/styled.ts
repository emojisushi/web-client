import styled, { css } from "styled-components";
import { ifProp, prop } from "styled-tools";
import { CSSProperties } from "react";
import { Placement } from "@floating-ui/react";

const Dropdown = styled.div`
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  position: relative;
  cursor: pointer;
`;

const Reference = styled.div<{
  width: CSSProperties["width"];
  open: boolean;
  placement: Placement;
}>`
  position: relative;
  display: flex;
  width: ${prop("width")};
  align-items: center;
  background-color: ${({ theme }) => theme.colors.canvas.inset2};
  height: 40px;
  padding-left: 15px;
  padding-right: 30px;
  --border-radius: ${({ theme }) => theme.borderRadius.smooth};
  border-radius: ${ifProp(
    "open",
    ifProp(
      { placement: "bottom" },
      "var(--border-radius) var(--border-radius) 0 0",
      "0 0 var(--border-radius) var(--border-radius)"
    ),
    "var(--border-radius)"
  )};
  color: ${({ theme }) => theme.colors.fg.default};
`;

const Content = styled.div<{
  width: CSSProperties["width"];
  open: boolean;
  placement: Placement;
}>`
  background-color: ${({ theme }) => theme.colors.canvas.inset2};
  width: ${prop("width")};
  --border-radius: ${({ theme }) => theme.borderRadius.smooth};
  ${(props) =>
    ifProp(
      {
        placement: "bottom",
      },
      css`
        border-top: ${ifProp(
          "open",
          `1px solid ${props.theme.colors.border.darker}`,
          "none"
        )};
        border-radius: 0 0 var(--border-radius) var(--border-radius);
      `,
      css`
        border-bottom: ${ifProp(
          "open",
          `1px solid ${props.theme.colors.border.darker}`,
          "none"
        )};
        border-radius: var(--border-radius) var(--border-radius) 0 0;
      `
    )(props)};
`;

export { Reference, Dropdown, Content };
