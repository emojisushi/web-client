import styled from "styled-components";

const Root = styled.div({
  display: "flex",
  gap: 10,
});

const Image = styled.div<{
  $src: string;
}>(({ $src }) => ({
  width: 100,
  height: 100,
  backgroundImage: `url("${$src}")`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
}));

const SecondColumn = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

const ButtonContainer = styled.div({
  marginTop: 10,
});

export { Root, Image, SecondColumn, ButtonContainer };
