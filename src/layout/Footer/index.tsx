import * as S from "./styled";
import {
  StaticMap,
  FlexBox,
  Container,
  SvgIcon,
  SkeletonWrap,
  NavLink,
} from "~components";
import { TelegramSvg, InstagramSvg, PhoneSvg, LogoSvg } from "~components/svg";
import { Trans, useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";

import { ModalIDEnum } from "~common/modal.constants";
import { useShowModal } from "~modal";
import { useTheme } from "styled-components";
import { ROUTES } from "~routes";
import { ICity } from "@layerok/emojisushi-js-sdk";
import { Fragment } from "react";
import { useClientAppVersion } from "~hooks/use-client-app-version";

type FooterProps = {
  loading?: boolean;
  city?: ICity;
};

export const Footer = ({ loading = false, city }: FooterProps) => {
  const theme = useTheme();
  const showModal = useShowModal();
  const { t } = useTranslation();
  const appVersion = useClientAppVersion();

  const renderPhoneSection = () => {
    if (city?.phones?.length < 1) {
      return null;
    }
    const renderPhone = ({ phone }: { phone: string }) => {
      if (loading) {
        return (
          <S.Phone>
            <Skeleton />
          </S.Phone>
        );
      }
      return <S.Phone href={`tel:${phone}`}>{phone}</S.Phone>;
    };
    const renderPhones = () => {
      if (loading) {
        return (
          <>
            {renderPhone({
              phone: "",
            })}
            {renderPhone({
              phone: "",
            })}
          </>
        );
      }
      if (!city.phones) {
        return null;
      }
      return city.phones.split(",").map((phone, i) => {
        return <Fragment key={i}>{renderPhone({ phone })}</Fragment>;
      });
    };
    return (
      <>
        <FlexBox
          style={{
            marginBottom: "15px",
          }}
          alignItems={"center"}
        >
          <SkeletonWrap loading={loading}>
            <SvgIcon width={"25px"} color={"white"}>
              <PhoneSvg />
            </SvgIcon>
          </SkeletonWrap>

          <S.PhoneLabel>
            <SkeletonWrap loading={loading}>
              <Trans i18nKey="footerPhones.phones" />
            </SkeletonWrap>
          </S.PhoneLabel>
        </FlexBox>

        <FlexBox flexDirection={"column"}>{renderPhones()}</FlexBox>
      </>
    );
  };

  const renderMap = () => {
    return (
      <S.StaticMap>
        {loading ? (
          <Skeleton width={"100%"} height={"100%"} />
        ) : (
          <StaticMap
            width={"100%"}
            height={"100%"}
            topLeft={"10px"}
            topRight={"10px"}
            bottomLeft={"0px"}
            bottomRight={"0px"}
          />
        )}
      </S.StaticMap>
    );
  };

  const renderInstagram = () => {
    return (
      <FlexBox alignItems={"center"}>
        <SkeletonWrap loading={loading}>
          <SvgIcon width={"25px"} color={"white"}>
            <InstagramSvg />
          </SvgIcon>
        </SkeletonWrap>

        <S.LinkContainer
          style={{
            flexGrow: 1,
          }}
        >
          <SkeletonWrap loading={loading}>
            <S.InstagramLink
              href={"https://www.instagram.com/emoji_sushi_/"}
              target={"_blank"}
            >
              emoji_sushi
            </S.InstagramLink>
          </SkeletonWrap>
        </S.LinkContainer>
      </FlexBox>
    );
  };

  const renderTelegram = () => {
    return (
      <FlexBox
        style={{
          marginTop: "10px",
          width: "100%",
        }}
        onClick={() => {
          showModal(ModalIDEnum.TelegramModal);
        }}
        alignItems={"center"}
      >
        <SkeletonWrap loading={loading}>
          <SvgIcon width={"25px"} color={"white"}>
            <TelegramSvg />
          </SvgIcon>
        </SkeletonWrap>

        <S.TelegramText>
          <SkeletonWrap loading={loading}>Telegram</SkeletonWrap>
        </S.TelegramText>
      </FlexBox>
    );
  };
  const renderPublicOffer = () => {
    return (
      <FlexBox flexDirection={"column"}>
        <NavLink to={ROUTES.PUBLIC_OFFER.path}>{t("public_offer")}</NavLink>
      </FlexBox>
    );
  };
  const renderRefundPolicy = () => {
    return (
      <FlexBox flexDirection={"column"}>
        <NavLink to={ROUTES.REFUND.path}>Правила повернення коштів</NavLink>
      </FlexBox>
    );
  };
  const renderLogo = () => {
    return (
      <SkeletonWrap loading={loading}>
        <SvgIcon color={theme.colors.brand}>
          <LogoSvg />
        </SvgIcon>
      </SkeletonWrap>
    );
  };
  const renderAppVersion = () => {
    return (
      <S.AppVersion>
        {t("app_version")}: {appVersion}
      </S.AppVersion>
    );
  };
  return (
    <S.Footer>
      <Container flexDirection={"row"}>
        <S.Left>
          {renderAppVersion()}
          <S.Logo>{renderLogo()}</S.Logo>
          <S.List>
            {renderPhoneSection()}
            {renderInstagram()}
            {renderTelegram()}
            {renderPublicOffer()}
            {renderRefundPolicy()}
          </S.List>
        </S.Left>
        <S.Right>{renderMap()}</S.Right>
      </Container>
    </S.Footer>
  );
};
