import styled from "styled-components";
import { prop } from "styled-tools";

export const Count = styled.div<{
  delimiterColor: string;
}>`
  font-size: 20px;
  line-height: 24px;
  width: 38px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid ${prop("delimiterColor")};
  border-right: 1px solid ${prop("delimiterColor")};
  color: ${prop("color", "black")};
`;
