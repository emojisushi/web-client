import styled from "styled-components";

const Container = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.fg.default};
  width: 100%;
  text-align: left;
`;

const Icon = styled.div`
  width: 25px;
  margin-right: 10px;
  flex-shrink: 0;
`;

const Label = styled.span`
  margin-right: 5px;
  height: 40px;
  display: flex;
  align-items: center;
`;

const CaretDown = styled.div`
  flex-shrink: 0;
`;

export { Container, Icon, Label, CaretDown };
