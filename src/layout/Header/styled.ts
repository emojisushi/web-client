import styled from "styled-components";
import media from "~common/custom-media";

const Container = styled.header`
  background: ${({ theme }) => theme.colors.canvas.inset};
  box-shadow: ${({ theme }) => theme.shadows.canvasInsetShadow};
  height: 91px;
  display: flex;
  align-items: center;
`;

const HeaderItem = styled.div`
  margin-right: 28px;
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;

  ${media.lessThan("pc")`
        display: none;
    `}
`;

const CartBtn = styled.div`
  cursor: pointer;
  ${media.lessThan("tablet")`
    display: none;
  `}
`;

const TinyCartBtn = styled.div`
  flex-shrink: 0;
  ${media.greaterThan("tablet")`
    display: none;
  `}
`;

const BurgerBtn = styled.button`
  display: none;

  ${media.lessThan("pc")`
    display: block;
    margin-left: 30px;
  `}
`;

const UserBtn = styled.div`
  margin-left: 20px;
  ${media.lessThan("pc")`
    display: none;
  `}
`;

const LanguageSelectorContainer = styled.div`
  margin-right: 20px;
  ${media.lessThan("pc")`
    margin-right: 30px;
  `}
  ${media.lessThan("tablet")`
    display: none;
  `}
`;

const LogoContainer = styled.div`
  margin-right: 75px;
  flex-shrink: 0;
`;

export {
  Container,
  HeaderItem,
  BurgerBtn,
  CartBtn,
  TinyCartBtn,
  UserBtn,
  LanguageSelectorContainer,
  LogoContainer,
};
