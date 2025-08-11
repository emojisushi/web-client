import styled from "styled-components";

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.canvas.inset2};
  padding: 20px 23px;
  width: 267px;
  box-shadow: ${({ theme }) => theme.shadows.canvasInset2Shadow};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.default};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.default};
  margin-top: 30px;
`;

const Item = styled.div`
  margin-top: 15px;
  :first-child {
    margin-top: 0;
  }
`;

const AppVersion = styled.div`
  opacity: 0.5;
  font-size: 12px;
  margin-top: 20px;
`;

export { Wrapper, Item, AppVersion };
