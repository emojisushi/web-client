import { useEffect, useState } from "react";
import * as S from "./styled";
import AppIconSrc from "../../../assets/img/app-icon.png";

const APP_STORE_URL =
  "https://apps.apple.com/ua/app/emojisushi-%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0-%D0%BE%D0%B4%D0%B5%D1%81%D0%B0/id6775604483";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.emojisushimobile";

const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const isIOS = () => {
  if (typeof navigator === "undefined") return false;

  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const STORAGE_KEY = "app-banner-closed";

interface MobileAppBannerProps {
  onVisibilityChange?: (visible: boolean) => void;
}

export const MobileAppBanner = ({
  onVisibilityChange,
}: MobileAppBannerProps) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const mobile = isMobileDevice();
    const closed = localStorage.getItem(STORAGE_KEY);

    onVisibilityChange?.(!closed);
    setVisible(mobile && !closed);
  }, [onVisibilityChange]);

  if (!visible) {
    return null;
  }

  const appUrl = isIOS() ? APP_STORE_URL : GOOGLE_PLAY_URL;

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    onVisibilityChange?.(false);

    setVisible(false);
  };

  return (
    <S.Banner>
      <S.CloseButton type="button" aria-label="Close" onClick={handleClose}>
        ×
      </S.CloseButton>

      <S.Content>
        <S.AppIcon>
          <img src={AppIconSrc} alt="App Icon" />
        </S.AppIcon>

        <S.Text>
          <S.DownloadText>Завантажити додаток</S.DownloadText>
          <S.AppName>EmojiSushi</S.AppName>
        </S.Text>

        <S.DownloadButton
          href={appUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          ЗАВАНТАЖИТИ
        </S.DownloadButton>
      </S.Content>
    </S.Banner>
  );
};
