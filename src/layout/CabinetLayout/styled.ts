import styled from "styled-components";
import media from "../../common/custom-media";

const Heading = styled.p`
  font-weight: 600;
  font-size: 25px;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.fg.default};
`;

const Container = styled.div`
  max-width: 1720px;
  margin: 0 auto;
`;

export const Content = styled.div`
  margin-top: 20px;
`;

const Cabinet = styled.div``;

const Navbar = styled.div`
  width: 350px;
  height: 220px;
  background: ${({ theme }) => theme.colors.canvas.inset2};
  box-shadow: ${({ theme }) => theme.shadows.canvasInset2Shadow};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  padding: 10px;
`;

const NavbarHeader = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.fg.default};
`;

const HorizontalBar = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border.darker};
  width: 330px;
  margin-top: 10px;
`;

const Wrapper = styled.div`
  display: flex;
  ${media.lessThan("tablet")`
    display: flex;
    flex-direction: column;
    
  `}
`;

const LeftSide = styled.div``;

const RightSide = styled.div`
  margin-left: 30px;
  ${media.lessThan("tablet")`
    margin-left: 0;
    margin-top: 30px;
  `}
`;

export {
  Heading,
  Container,
  Cabinet,
  Navbar,
  NavbarHeader,
  HorizontalBar,
  Wrapper,
  LeftSide,
  RightSide,
};
