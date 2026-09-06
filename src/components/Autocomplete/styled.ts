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
  background: #1c1c1c;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  list-style: none;
  margin: 0px 0 0 0;
  padding: 0;
  border-radius: 0px 0px 10px 10px;
  border-top: 1px solid #2d2d2d;
`;

const DropdownItem = styled.li`
  padding: 2px 8px;
  cursor: pointer;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  &:hover {
    background-color: #272727;
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
  background: ${(props) => props.theme.colors.canvas.inset2};
  box-shadow: ${({ theme }) => theme.shadows.canvasShadow};
  border-radius: ${({ theme, open }) =>
    open ? "10px 10px 0px 0px" : theme.borderRadius.smooth};
  padding: 11px 10px;
  border: none;
  width: ${prop("width", "100%")};
  color: ${({ theme }) => theme.colors.fg.default};
  outline: ${(props) => (props.open ? "transparent" : "0px")};

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
const Error = styled.p`
  font-size: 10px;
  line-height: 12px;
  padding: 2px 5px;
  background-color: ${({ theme }) => theme.colors.danger.canvas};
  color: ${({ theme }) => theme.colors.fg.default};
  user-select: none;
  position: absolute;
  right: 0;
  z-index: 3;
`;

export { AutocompleteWrapper, Dropdown, DropdownItem, NoResults, Input, Error };
