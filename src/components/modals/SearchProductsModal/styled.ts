import styled from "styled-components";

const Wrapper = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin: 0;
  width: 100dvw;
  height: 100dvh;
`;

const Results = styled.div({
  marginTop: 20,
  display: "flex",
  flexDirection: "column",
  gap: 20,
});

export { Wrapper, Results };
