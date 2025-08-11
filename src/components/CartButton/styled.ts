import styled from "styled-components";

const Icon = styled.div`
  margin-right: 10px;
  display: flex;
  align-items: center;
`;

const Price = styled.div`
  margin-right: 15px;
  flex-shrink: 0;
`;

const Delimiter = styled.div`
  height: 20px;
  width: 1px;
  background-color: ${({ theme }) => theme.colors.fg.brandContrast};
  flex-shrink: 0;
`;

const Count = styled.div`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin-left: 15px;
`;

export { Price, Delimiter, Count, Icon };
