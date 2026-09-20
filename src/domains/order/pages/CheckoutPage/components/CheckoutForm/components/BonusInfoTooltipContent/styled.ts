import styled from "styled-components";

const Wrapper = styled.div`
  width: 255px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background: ${({ theme }) => theme.colors.canvas.inset3};
  box-shadow: ${({ theme }) => theme.shadows.canvasInset2Shadow};
  padding: 10px;
`;

const Item = styled.div`
  :not(:first-child) {
    margin-top: 10px;
  }
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
`;

const Description = styled.div`
  margin-top: 2px;
  font-size: 13px;
  line-height: 16px;
  color: rgba(255, 255, 255, 0.55);
`;

export { Wrapper, Item, Title, Description };
