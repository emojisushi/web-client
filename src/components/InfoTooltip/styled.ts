import styled from "styled-components";

const LabelWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.canvas.inset3};
  border-radius: ${({ theme }) => theme.borderRadius.smooth};
  padding: 10px;
  font-size: 12px;
  width: 160px;
`;

export { LabelWrapper };
