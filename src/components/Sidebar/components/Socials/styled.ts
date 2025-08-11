import styled from "styled-components";

const Text = styled.p`
  color: ${({ theme }) => theme.colors.fg.default};
  font-weight: 400;
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 15px;
`;

const OneSvg = styled.a`
  margin-right: 10px;
  display: inline-block;
`;

const SvgContainer = styled.div`
  display: flex;
  margin-right: 10px;
`;

export { Text, SvgContainer, OneSvg };
