import styled from "styled-components";
import { ifProp } from "styled-tools";

const Link = styled.span<{
  isActive: boolean;
  end: boolean;
}>`
  font-weight: 400;
  text-decoration: none;
  font-size: 15px;
  line-height: 18px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  color: ${ifProp("isActive", "#FFE600", "#FFFFFF")};
  :hover {
    color: #ffe600;
  }
  :after {
    border-bottom: none;
  }
`;

export { Link };
