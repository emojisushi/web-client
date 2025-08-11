import styled from "styled-components";
import { ifProp } from "styled-tools";

const Categories = styled.nav`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
`;

const Category = styled.span<{
  isActive: boolean;
}>`
  text-transform: uppercase;
  line-height: 20px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  color: ${(props) =>
    ifProp("isActive", props.theme.colors.brand, "white")(props)};

  &:hover {
    color: ${({ theme }) => theme.colors.brand};
  }
`;

export { Categories, Category };
