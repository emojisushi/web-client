import styled from "styled-components";

const Heading = styled.p`
  font-weight: 600;
  font-size: 25px;
  line-height: 30px;

  color: ${({ theme }) => theme.colors.fg.default};
`;

export { Heading };
