import {
  Modal,
  LowKeySvg,
  SvgIcon,
  ModalContent,
  ModalCloseButton,
} from "~components";
import { useTranslation } from "react-i18next";
import { addLeadingZero } from "~utils/format.utils";
import { appConfig } from "~config/app";
import NiceModal from "@ebay/nice-modal-react";
import { useModal } from "~modal";
import { useTheme } from "styled-components";
import * as S from "./styled";

// todo: reopen this modal every n seconds
export const RestaurantClosed = NiceModal.create(() => {
  const { t } = useTranslation();
  const modal = useModal();
  const theme = useTheme();
  modal.resolve();
  return (
    <Modal
      overlayStyles={{
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0, 0, 0, 0.4)",
        zIndex: theme.zIndices.modals,
      }}
      onClose={() => {
        modal.remove();
      }}
      open={modal.visible}
    >
      <ModalContent>
        <ModalCloseButton />
        <S.Root>
          <SvgIcon color={theme.colors.brand} width={"60px"}>
            <LowKeySvg />
          </SvgIcon>
          <S.Title>{t("restaurantClosed.closed")}</S.Title>
          <S.Subtitle>
            {t("restaurantClosed.time", {
              from: `${appConfig.workingHours[0][0]}:${addLeadingZero(
                appConfig.workingHours[0][1]
              )}`,
              to: `${appConfig.workingHours[1][0]}:${addLeadingZero(
                appConfig.workingHours[1][1]
              )}`,
            })}
          </S.Subtitle>
        </S.Root>
      </ModalContent>
    </Modal>
  );
});
