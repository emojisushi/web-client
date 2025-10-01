import styled from "styled-components";
import { ifProp, prop } from "styled-tools";

const AutocompleteWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #1C1C1C;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  margin: 0px 0 0 0;
  padding: 0;
  border-radius:0px 0px 10px 10px;
`;

const DropdownItem = styled.li`
  padding: 8px 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    background-color: #181818ff;
  }
`;

const NoResults = styled.li`
  padding: 8px 12px;
`;

const Input = styled.input<{
  light: boolean;
  open: boolean;
}>`
  position: relative;
  background: ${(props) =>
    ifProp(
      "light",
      props.theme.colors.canvas.inset4,
      props.theme.colors.canvas.inset2
    )(props)};
  box-shadow: ${({ theme }) => theme.shadows.canvasShadow};
  border-radius: ${({ theme, open }) => open ? "10px 10px 0px 0px" : theme.borderRadius.smooth};
  padding: 11px 10px;
  border: none;
  width: ${prop("width", "100%")};
  color: ${({ theme }) => theme.colors.fg.default};
  outline: ${props => props.open ? "transparent" : "0px"};


  ::-webkit-input-placeholder {
    color: ${({ theme }) => theme.components.input.placeholder};
  }

  ::-moz-placeholder {
    color: ${({ theme }) => theme.components.input.placeholder};
  }

  :-ms-input-placeholder {
    color: ${({ theme }) => theme.components.input.placeholder};
  }

  :-moz-placeholder {
    color: ${({ theme }) => theme.components.input.placeholder};
  }
`;

export { AutocompleteWrapper, Dropdown, DropdownItem, NoResults, Input }