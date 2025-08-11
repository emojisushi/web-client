import * as S from "./styled";
import {
  SvgIcon,
  FlexBox,
  StaticMap,
  Modal,
  ModalContent,
  ModalCloseButton,
} from "~components";
import { PhoneSvg, InstagramSvg, TelegramSvg } from "~components/svg";
import { useTranslation } from "react-i18next";
import { InstagramLink } from "~layout/Footer/styled";
import NiceModal from "@ebay/nice-modal-react";
import { useModal } from "~modal";
import { useCurrentCitySlug } from "~domains/city/hooks/useCurrentCitySlug";
import { useQuery } from "@tanstack/react-query";
import { citiesQuery } from "~domains/city/cities.query";
import { useTheme } from "styled-components";

export const ContactsModal = NiceModal.create(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const modal = useModal();
  const citySlug = useCurrentCitySlug();
  const { data: cities, isLoading: isCitiesLoading } = useQuery(citiesQuery);
  const city = (cities?.data || []).find((c) => c.slug === citySlug);

  const renderPhones = () => {
    if (!city?.phones) {
      return null;
    }
    return (
      <>
        <S.Title>{t("contactsModal.contacts")}</S.Title>
        <S.Phones>
          <SvgIcon
            style={{ marginRight: "11px" }}
            width={"25px"}
            color={"white"}
          >
            <PhoneSvg />
          </SvgIcon>
          {city.phones.split(",").map((phone, i) => (
            <S.Phone key={i}>{phone}</S.Phone>
          ))}
        </S.Phones>
      </>
    );
  };

  return (
    <Modal
      overlayStyles={{
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0, 0, 0, 0.4)",
        zIndex: theme.zIndices.modals,
      }}
      open={modal.visible}
      onClose={() => {
        modal.remove();
      }}
    >
      <ModalContent>
        <ModalCloseButton />

        <div>
          <S.Wrapper>
            {renderPhones()}
            <S.Socials>
              <FlexBox style={{ marginRight: "20px" }} alignItems={"center"}>
                <SvgIcon
                  style={{ marginRight: "10px" }}
                  width={"25px"}
                  color={"white"}
                >
                  <InstagramSvg />
                </SvgIcon>
                <InstagramLink
                  href={"https://www.instagram.com/emoji_sushi_/"}
                  target={"_blank"}
                >
                  emoji_sushi
                </InstagramLink>
              </FlexBox>

              <FlexBox
                style={{ cursor: "pointer" }}
                alignItems={"center"}
                onClick={() => {
                  window.open("https://t.me/Emojisushibot", "_blank");
                }}
              >
                <SvgIcon
                  clickable={true}
                  style={{ marginRight: "10px" }}
                  width={"25px"}
                  color={"white"}
                >
                  <TelegramSvg />
                </SvgIcon>
                <span>Telegram</span>
              </FlexBox>
            </S.Socials>
          </S.Wrapper>
          <StaticMap style={{ marginTop: "30px" }} height={"220px"} />
        </div>
      </ModalContent>
    </Modal>
  );
});
