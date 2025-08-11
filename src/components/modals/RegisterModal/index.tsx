import * as S from "./styled";
import { FormEventHandler, useState } from "react";
import {
  PasswordInput,
  Checkbox,
  Input,
  FlexBox,
  Modal,
  ModalContent,
  ModalCloseButton,
} from "~components";
import { Button } from "~common/ui-components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRegister } from "~hooks/use-auth";
import axios, { AxiosError } from "axios";
import { cartQuery } from "~domains/cart/cart.query";
import NiceModal from "@ebay/nice-modal-react";
import { ROUTES } from "~routes";
import { useModal } from "~modal";
import { ModalIDEnum } from "~common/modal.constants";
import { TextButton } from "~common/ui-components/TextButton";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "styled-components";
import { catalogQuery } from "~domains/catalog/catalog.query";

export const RegisterModal = NiceModal.create(
  ({ redirect_to }: { redirect_to?: string }) => {
    const queryClient = useQueryClient();
    const theme = useTheme();
    const modal = useModal();
    const { t } = useTranslation();
    const [checked, setChecked] = useState(false);
    const register = useRegister();
    const navigate = useNavigate();
    const [errors, setErrors] = useState<{
      email?: string[];
      password?: string[];
      name?: string[];
      surname?: string[];
      agree?: string[];
    }>({});

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") + "";
      const password = formData.get("password") + "";
      const password_confirmation = formData.get("password") + "";
      const name = formData.get("name") + "";
      const surname = formData.get("surname") + "";
      const agree = !!formData.get("agree");

      setErrors({});

      register.mutate(
        {
          email,
          password,
          password_confirmation,
          name,
          surname,
          agree,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(catalogQuery.queryKey);
            queryClient.invalidateQueries(cartQuery.queryKey);
            navigate(ROUTES.ACCOUNT.PROFILE.path);
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

    const openSignIn = (e) => {
      e.preventDefault();
      NiceModal.show(ModalIDEnum.AuthModal);
      NiceModal.hide(ModalIDEnum.RegisterModal);
    };

    const closeModal = () => {
      modal.remove();
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
        onClose={closeModal}
      >
        <ModalContent>
          <ModalCloseButton />
          <S.Wrapper>
            <S.Form onSubmit={handleSubmit}>
              <S.Title>{t("authModal.registration.title")}</S.Title>
              <Input
                label={t("common.first_name")}
                name="name"
                error={errors?.name?.[0]}
                light={true}
              />

              <Input
                label={t("common.last_name")}
                style={{
                  marginTop: 20,
                }}
                name="surname"
                error={errors?.surname?.[0]}
                light={true}
              />

              <Input
                label={t("common.email")}
                style={{
                  marginTop: 20,
                }}
                name="email"
                error={errors?.email?.[0]}
                light={true}
              />

              <PasswordInput
                label={t("common.password")}
                style={{
                  marginTop: 20,
                }}
                name="password"
                error={errors?.password?.[0]}
                light={true}
              />

              <S.CheckboxWrapper>
                <Checkbox
                  checked={checked}
                  error={errors?.agree?.[0]}
                  onChange={(e) => {
                    setChecked(e.target.checked);
                  }}
                  name="agree"
                >
                  {t("common.privacyPolicyAgreed")}
                </Checkbox>
              </S.CheckboxWrapper>

              <FlexBox>
                <FlexBox flexDirection={"column"} alignItems={"center"}>
                  <Button loading={register.isLoading}>
                    {t("common.registration")}
                  </Button>

                  <TextButton
                    style={{ paddingTop: "10px" }}
                    onClick={openSignIn}
                  >
                    {t("common.enter")}
                  </TextButton>
                </FlexBox>
              </FlexBox>
            </S.Form>
          </S.Wrapper>
        </ModalContent>
      </Modal>
    );
  }
);
