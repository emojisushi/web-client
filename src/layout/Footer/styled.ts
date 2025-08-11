import styled from "styled-components";
import media from "../../common/custom-media";

const Footer = styled.footer`
  width: 100%;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.canvas.inset};
  height: 239px;
  overflow: hidden;

  & > div {
    height: 100%;
    display: flex;
    ${media.lessThan("tablet")`
        flex-direction: column;
    `}
  }

  ${media.lessThan("tablet")`
        height: auto;
    `}
`;

const Left = styled.div`
  display: flex;
  align-items: center;

  ${media.lessThan("tablet")`
        margin-top: 30px;
        align-items: start;
    `}
`;

const AppVersion = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  bottom: 0;
  padding-bottom: 16px;
  font-size: 13px;
  opacity: 0.5;
  ${media.lessThan("pc")`
        display: none;
    `}
`;

const Right = styled.div`
  ${media.lessThan("tablet")`
        margin-top: 30px;
    `}
`;

const Logo = styled.div`
  width: 160px;
  margin-right: 220px;
  ${media.lessThan("pc")`
        margin-right: 86px;
    `}
  ${media.lessThan("tablet")`
        margin-right: 30px;
    `}
`;

const List = styled.div``;

const Phone = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.fg.default};
  margin-bottom: 10px;
  width: 100%;
`;

const LinkContainer = styled.div`
  margin-left: 10px;
`;

const InstagramLink = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.fg.default};
`;

const PhoneLabel = styled.div`
  margin-left: 10px;
`;

const TelegramText = styled.p`
  margin-left: 10px;
  width: 100%;
  flex-grow: 1;
`;

const StaticMap = styled.div`
  width: 350px;
  height: 187px;
  margin-left: 237px;
  margin-top: 52px;

  ${media.lessThan("pc")`
        width: 255px;
        height 187px;
        margin-left: 86px;
    `}
  ${media.lessThan("tablet")`
        width: 350px;
        height: 187px;
        margin: 0;
        
    `}
`;

export {
  Footer,
  Left,
  Right,
  Logo,
  List,
  Phone,
  PhoneLabel,
  InstagramLink,
  TelegramText,
  StaticMap,
  LinkContainer,
  AppVersion,
};
