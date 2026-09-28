import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  padding-left: 10px;
  background: ${({ theme }) => theme.colors.canvas.inset2};
  box-shadow: ${({ theme }) => theme.shadows.canvasShadow};
  border-radius: ${({ theme }) => theme.borderRadius.smooth};
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  padding: 11px 5px 11px 0;
  color: ${({ theme }) => theme.colors.fg.default};
  font-size: inherit;
  font-family: inherit;

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Suffix = styled.span`
  color: ${({ theme }) => theme.colors.fg.muted};
  font-size: 13px;
  white-space: nowrap;
  padding-right: 10px;
  user-select: none;
`;

const MaxButton = styled.button`
  border: none;
  cursor: pointer;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.brand};
  box-shadow: ${({ theme }) => theme.shadows.canvasShadow};
  border-radius: ${({ theme }) => theme.borderRadius.smooth};
  color: black;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.02em;
  white-space: nowrap;

  :hover {
    background: ${({ theme }) => theme.colors.brandDelimiter};
  }

  :disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

const Error = styled.p`
  font-size: 10px;
  line-height: 12px;
  margin-top: 4px;
  padding: 2px 5px;
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.danger.canvas};
  color: ${({ theme }) => theme.colors.fg.default};
`;

export { Wrapper, InputRow, Input, Suffix, MaxButton, Error };
