import styled from "styled-components";
import { ifProp, prop } from "styled-tools";

const Wrapper = styled.div`
  position: relative;
`;

const Input = styled.input<{
  light: boolean;
  hasEndAdornment: boolean;
}>`
  position: relative;
  background: ${(props) =>
    ifProp(
      "light",
      props.theme.colors.canvas.inset4,
      props.theme.colors.canvas.inset2
    )(props)};
  box-shadow: ${({ theme }) => theme.shadows.canvasShadow};
  border-radius: ${({ theme }) => theme.borderRadius.smooth};
  padding: 11px ${({ hasEndAdornment }) => (hasEndAdornment ? "35px" : "10px")}
    11px 10px;
  border: none;
  width: ${prop("width", "100%")};
  color: ${({ theme }) => theme.colors.fg.default};

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

const Asterisk = styled.div`
  position: absolute;
  top: 0;
  left: 0;
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

export { Input, Wrapper, Asterisk, Error };
