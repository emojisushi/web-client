import * as S from "./styled";
import { FormEventHandler, useState } from "react";
import {
  PasswordInput,
  Input,
  FlexBox,
  Modal,
  ModalContent,
  ModalCloseButton,
} from "~components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLogin } from "~hooks/use-auth";
import axios, { AxiosError } from "axios";
import { cartQuery } from "~domains/cart/cart.query";

import NiceModal from "@ebay/nice-modal-react";
import { ROUTES } from "~routes";
import { useModal } from "~modal";
import { ModalIDEnum } from "~common/modal.constants";
import { TextButton } from "~common/ui-components/TextButton";
import { Button } from "~common/ui-components/Button/Button";
import { useQueryClient } from "@tanstack/react-query";
import { catalogQuery } from "~domains/catalog/catalog.query";

export const AuthModal = NiceModal.create(
  ({ redirect_to }: { redirect_to?: string }) => {
    const modal = useModal();
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const login = useLogin();
    const navigate = useNavigate();
    const [errors, setErrors] = useState<{
      email?: string[];
      password?: string[];
    }>({});

    const closeModal = () => {
      modal.remove();
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
      e.preventDefault();
      // TODO: use formik
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string | null;
      const password = formData.get("password") as string | null;
      setErrors({});
      login.mutate(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(catalogQuery.queryKey);
            queryClient.invalidateQueries(cartQuery.queryKey);
            navigate(redirect_to || ROUTES.ACCOUNT.PROFILE.path);
            closeModal();
          },
          onError: (err) => {
            if (!axios.isAxiosError(err)) {
              return;
            }
            const error = err as AxiosError<{
              message: string;
              errors?: Record<string, string[]>;
            }>;
            const errors = error.response?.data?.errors;
            const message = error.response?.data?.message;
            if (errors) {
              setErrors(errors);
            } else if (message) {
              setErrors({
                email: [error.response.data.message],
              });
            }
          },
        }
      );
    };

    const openSignupModal = (e) => {
      e.preventDefault();
      NiceModal.show(ModalIDEnum.RegisterModal);
      NiceModal.hide(ModalIDEnum.AuthModal);
    };

    const openResetPasswordModal = (e) => {
      e.preventDefault();
      NiceModal.hide(ModalIDEnum.AuthModal);
      NiceModal.show(ModalIDEnum.ResetPasswordModal);
    };

    return (
      <Modal open={modal.visible} onClose={closeModal}>
        <ModalContent>
          <ModalCloseButton />
          <S.Wrapper>
            <S.Form onSubmit={handleSubmit}>
              <S.Title>{t("authModal.login.title")}</S.Title>
              <Input
                label={t("common.email")}
                name={"email"}
                error={errors?.email?.[0]}
                light={true}
              />

              <PasswordInput
                style={{
                  marginTop: 20,
                }}
                label={t("common.password")}
                name={"password"}
                error={errors?.password?.[0]}
                light={true}
              />

              <FlexBox justifyContent={"flex-end"}>
                <TextButton
                  style={{ paddingTop: "10px" }}
                  onClick={openResetPasswordModal}
                >
                  {t("common.forgotPassword")}
                </TextButton>
              </FlexBox>

              <Button
                loading={login.isLoading}
                type="submit"
                style={{ marginTop: "20px", display: "flex" }}
              >
                {t("common.login")}
              </Button>

              <TextButton
                style={{ paddingTop: "10px" }}
                onClick={openSignupModal}
              >
                {t("common.registration")}
              </TextButton>
            </S.Form>
          </S.Wrapper>
        </ModalContent>
      </Modal>
    );
  }
);
