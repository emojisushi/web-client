import styled from "styled-components";
import { ifProp } from "styled-tools";

const Button = styled.button<{
  $disabled: boolean;
}>`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border-style: solid;
  border-width: 1px;
  border-color: ${(props) =>
    ifProp(
      "$disabled",
      props.theme.colors.grey["571"],
      props.theme.colors.grey["571"]
    )(props)};
  background: ${(props) =>
    ifProp(
      "$disabled",
      props.theme.colors.grey["571"],
      props.theme.colors.grey["571"]
    )(props)};
  color: ${(props) =>
    ifProp("$disabled", props.theme.colors.grey["300"], "white")(props)};
  :hover {
    border-color: ${({ theme }) => theme.colors.brand};
    color: ${({ theme }) => theme.colors.brand};
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Counter = styled.div`
  font-size: 22px;
  font-weight: 500;
  line-height: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  padding-left: 5px;
  padding-right: 5px;
`;

export { ButtonWrapper, Counter, Button };
