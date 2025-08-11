import styled from "styled-components";
import { theme } from "styled-tools";

const TinyCartButton = styled.div`
  cursor: pointer;
  position: relative;
  margin-top: 20px;
`;

const Icon = styled.div`
  position: absolute;
  z-index: 1;
  top: -20px;
  transform-origin: center;
  transform: translateX(-50%);
  left: 50%;
`;

const Price = styled.div`
  position: relative;
  background-color: ${theme("colors.brand")};
  color: black;
  padding: 1px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.almostSquare};
  min-width: 55px;
  text-align: center;
  z-index: 2;
`;

export { TinyCartButton, Price, Icon };
