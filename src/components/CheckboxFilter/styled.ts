import styled from "styled-components";

const Wrapper = styled.div`
  margin-top: 10px;
`;

const Label = styled.label`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  border: 1px solid #393939;
  border-radius: ${({ theme }) => theme.borderRadius.smooth};
  padding: 11px 33px;
  font-size: 15px;
  line-height: 18px;

  &:hover {
    background: #393939;
  }
`;

const CheckBoxWrapper = styled.div`
  background: ${({ theme }) => theme.colors.canvas.inset2};
  overflow: hidden;
  margin-top: 10px;
  margin-right: 10px;
`;

const CheckBox = styled.input`
  display: none;
  :checked {
    ~ ${Label} {
      background: #393939;
    }
  }
`;

export { CheckBox, Label, Wrapper, CheckBoxWrapper };
