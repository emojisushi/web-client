import * as S from "./styled";
import { Popover } from "../Popover";
import { ButtonFilled, ButtonOutline } from "../../buttons/Button";
import { FlexBox } from "../../FlexBox";
import { useTranslation } from "react-i18next";

export const ConfirmActionPopover = ({
  text,
  onConfirm,
  initiallyOpen = false,
  onCancel,
  children,
}) => {
  const { t } = useTranslation();
  return (
    <Popover
      open={initiallyOpen}
      render={({ close }) => (
        <S.Wrapper>
          {text}
          <FlexBox
            style={{ marginTop: "20px" }}
            justifyContent={"space-between"}
          >
            <ButtonOutline onClick={() => onConfirm({ close })} width={"162px"}>
              {t("confirmAction.yes")}
            </ButtonOutline>
            <ButtonFilled onClick={() => onCancel({ close })} width={"162px"}>
              {t("confirmAction.no")}
            </ButtonFilled>
          </FlexBox>
        </S.Wrapper>
      )}
    >
      {children}
    </Popover>
  );
};
