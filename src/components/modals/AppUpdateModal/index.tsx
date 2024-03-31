import { SvgIcon, NotifyModal } from "~components";
import { useTranslation } from "react-i18next";
import { Button } from "~common/ui-components/Button/Button";

import NiceModal from "@ebay/nice-modal-react";
import { useModal } from "~modal";
import { useTheme } from "styled-components";

const ArrowDownSvg = () => {
  return (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_1"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      width="512"
      height="512"
    >
      <path d="M22,19.5c0,2.48-2.02,4.5-4.5,4.5H6.5c-1.2,0-2.33-.47-3.18-1.32-.85-.85-1.32-1.98-1.32-3.18V9.5c0-2.48,2.01-4.5,4.5-4.5h1.5c.28,0,.5,.23,.5,.51,0,.28-.22,.5-.5,.5h-1.5c-1.93,0-3.5,1.57-3.5,3.5v10c0,.94,.37,1.81,1.03,2.48,.66,.66,1.54,1.02,2.47,1.02h11c1.93,0,3.5-1.57,3.5-3.5V9.51c0-.94-.37-1.82-1.03-2.48-.66-.66-1.54-1.02-2.47-1.02h-1.5c-.28,0-.5-.22-.5-.5s.22-.5,.5-.5h1.49s.01,0,.01,0c1.2,0,2.33,.47,3.18,1.31,.85,.85,1.32,1.98,1.32,3.19v9.99ZM7.35,13.14c-.2-.19-.52-.18-.71,.02-.19,.2-.18,.52,.02,.71l3.58,3.41c.47,.47,1.1,.73,1.77,.73s1.29-.26,1.76-.72l3.59-3.41c.2-.19,.21-.51,.02-.71-.19-.2-.51-.21-.71-.02l-3.59,3.42c-.16,.16-.35,.28-.56,.35V.5c0-.28-.23-.5-.5-.5s-.5,.22-.5,.5V16.91c-.21-.07-.4-.19-.57-.35l-3.59-3.41Z" />
    </svg>
  );
};

export const AppUpdateModal = NiceModal.create(() => {
  const { t } = useTranslation();

  const modal = useModal();
  const theme = useTheme();

  return (
    <NotifyModal
      open={modal.visible}
      onClose={() => {
        modal.remove();
      }}
      renderTitle={() => t("appUpdate.title")}
      renderSubtitle={() => t("appUpdate.subtitle")}
      renderIcon={() => (
        <SvgIcon color={theme.colors.brand} width={"60px"}>
          <ArrowDownSvg />
        </SvgIcon>
      )}
      renderButton={() => (
        <Button
          filled={true}
          onClick={() => {
            window.location.reload();
          }}
        >
          {t("appUpdate.action")}
        </Button>
      )}
    />
  );
});
