import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import * as S from "./styled";
import { SvgButton } from "~components/SvgButton";
import { SvgIcon } from "~components/SvgIcon";
import { InstagramSvg, TelegramSvg } from "~components/svg";
import { ModalIDEnum } from "~common/modal.constants";
import { useShowModal } from "~modal";
import { PlayMarketSvg } from "~components/svg/PlayMarketSvg";
import { AppStoreSvg } from "~components/svg/AppStoreSvg";

type SocialsProps = {
  loading?: boolean;
};
const APP_STORE_URL =
  "https://apps.apple.com/ua/app/emojisushi-%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0-%D0%BE%D0%B4%D0%B5%D1%81%D0%B0/id6775604483";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.emojisushimobile";

export const Socials = ({ loading = false }: SocialsProps) => {
  const { t } = useTranslation();
  const showModal = useShowModal();
  return (
    <>
      <S.Text>
        {loading ? <Skeleton /> : t("underVerticalMenu.in_touch")}
      </S.Text>
      <S.SvgContainer>
        <S.OneSvg
          href={"https://www.instagram.com/emoji_sushi_/"}
          target={"_blank"}
        >
          {loading ? (
            <Skeleton width={40} height={40} />
          ) : (
            <SvgButton>
              <SvgIcon color={"black"} style={{ cursor: "pointer" }}>
                <InstagramSvg />
              </SvgIcon>
            </SvgButton>
          )}
        </S.OneSvg>
        <S.OneSvg>
          {loading ? (
            <Skeleton width={40} height={40} />
          ) : (
            <SvgButton
              onClick={() => {
                showModal(ModalIDEnum.TelegramModal);
              }}
            >
              <SvgIcon color={"black"} style={{ cursor: "pointer" }}>
                <TelegramSvg />
              </SvgIcon>
            </SvgButton>
          )}
        </S.OneSvg>
        <S.OneSvg href={GOOGLE_PLAY_URL} target={"_blank"}>
          {loading ? (
            <Skeleton width={40} height={40} />
          ) : (
            <SvgButton>
              <SvgIcon color={"black"} style={{ cursor: "pointer" }}>
                <PlayMarketSvg />
              </SvgIcon>
            </SvgButton>
          )}
        </S.OneSvg>

        <S.OneSvg href={APP_STORE_URL} target={"_blank"}>
          {loading ? (
            <Skeleton width={40} height={40} />
          ) : (
            <SvgButton>
              <SvgIcon color={"black"} style={{ cursor: "pointer" }}>
                <AppStoreSvg />
              </SvgIcon>
            </SvgButton>
          )}
        </S.OneSvg>
      </S.SvgContainer>
    </>
  );
};
