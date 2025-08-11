import styled from "styled-components";

const OldPrice = styled.div`
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;
  text-decoration-line: line-through;
  color: #838383;
`;

const NewPrice = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;

  color: ${({ theme }) => theme.colors.fg.default};
`;

export { OldPrice, NewPrice };
