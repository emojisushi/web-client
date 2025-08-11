import styled from "styled-components";
import { prop } from "styled-tools";
import { CSSProperties } from "react";

const Options = styled.div<{
  width: CSSProperties["width"];
  backgroundColor: CSSProperties["backgroundColor"];
}>`
  padding: 11px 25px 19px;
  width: ${prop("width")};
  background-color: ${prop("backgroundColor")};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.default};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.default};
`;

const Option = styled.div`
  margin-bottom: 15px;
  cursor: pointer;
`;

export { Options, Option };
