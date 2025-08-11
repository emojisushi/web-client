import styled from "styled-components";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  position: relative;
`;

const Main = styled.main`
  flex-grow: 1;
`;

const TinyCartButtonOverlay = styled.div({
  background: "rgba(0, 0, 0, 0.4)",
  padding: 6,
  borderRadius: 6,
});

export { Layout, Main, TinyCartButtonOverlay };
