import * as S from "./styled";
import { FormEventHandler, useState } from "react";
import { Modal, Input, ModalContent, ModalCloseButton } from "~components";
import { useTranslation } from "react-i18next";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import NiceModal from "@ebay/nice-modal-react";
import { useModal } from "~modal";
import { ModalIDEnum } from "~common/modal.constants";
import { TextButton } from "~common/ui-components/TextButton";
import { Button } from "~common/ui-components/Button/Button";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { useTheme } from "styled-components";

const defaultErrors = {
  email: [""],
};

export const ResetPasswordModal = NiceModal.create(
  ({ redirect_to }: { redirect_to?: string }) => {
    const modal = useModal();
    const { t } = useTranslation();
    const theme = useTheme();

    const { mutate: resetPassword, isLoading } = useMutation({
      mutationFn: (email: string) => {
        return EmojisushiAgent.restorePassword({
          email,
          redirect_url: window.location.origin + "/reset-password",
        });
      },
    });

    const [errors, setErrors] =
      useState<Record<string, string[]>>(defaultErrors);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") + "";
      setErrors(defaultErrors);
      setIsSent(false);
      resetPassword(email, {
        onSuccess: () => {
          setIsSent(true);
        },
        onError: (e) => {
          if (!axios.isAxiosError(e)) {
            return;
          }
          const error = e as AxiosError<{
            message: string;
            errors?: Record<string, string[]>;
          }>;

          const errors = error.response?.data?.errors;
          const message = error.response?.data?.message;
          if (message) {
            setErrors({
              email: [message],
            });
          } else if (errors) {
            setErrors(errors);
          }
        },
      });
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
          <S.Wrapper>
            <S.Form onSubmit={handleSubmit}>
              <S.Title>{t("authModal.forgetPassword.title")}</S.Title>
              <Input
                label={t("common.email")}
                name={"email"}
                error={errors?.email?.[0]}
                light={true}
              />
              {isSent && (
                <S.ForgotPassText
                  style={{
                    color: "green",
                  }}
                >
                  {t("authModal.forgetPassword.mailSent")}
                </S.ForgotPassText>
              )}
              {!isSent && (
                <S.ForgotPassText>
                  {t("authModal.forgetPassword.typeEmail")}
                </S.ForgotPassText>
              )}
              <S.BtnGroup>
                <TextButton
                  onClick={(e) => {
                    NiceModal.show(ModalIDEnum.AuthModal);
                    NiceModal.hide(ModalIDEnum.ResetPasswordModal);
                  }}
                >
                  {t("common.back")}
                </TextButton>
                <Button loading={isLoading} type="submit">
                  {t("common.recover")}
                </Button>
              </S.BtnGroup>
            </S.Form>
          </S.Wrapper>
        </ModalContent>
      </Modal>
    );
  }
);
