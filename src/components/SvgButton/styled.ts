import styled from "styled-components";

const Box = styled.div`
  background-color: ${({ theme }) => theme.colors.brand};
  box-shadow: ${({ theme }) => theme.shadows.brand};
  border-radius: ${({ theme }) => theme.borderRadius.lessSmooth};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export { Box };
