import { observer } from "mobx-react";
import * as S from "./styled";
import { PasswordInput } from "~components";
import { transaction } from "mobx";
import { useTranslation } from "react-i18next";
import { Form } from "react-router-dom";
import { useRef, useState } from "react";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { Button } from "~common/ui-components/Button/Button";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";

const getError = (error: string | string[] | undefined) => {
  if (Array.isArray(error)) {
    return error[0];
  }
  return error;
};

export const UpdatePasswordPage = observer(() => {
  const { t } = useTranslation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const intervalId = useRef(null);
  const [errors, setErrors] = useState<{
    password?: string[] | string;
    password_confirmation?: string[] | string;
    password_old?: string[] | string;
  }>({});

  const mutation = useMutation({
    mutationFn: ({
      password,
      password_confirmation,
      password_old,
    }: {
      password: string;
      password_confirmation: string;
      password_old: string;
    }) => {
      return EmojisushiAgent.updateUserPassword({
        password: password + "",
        password_confirmation: password_confirmation + "",
        password_old: password_old + "",
      });
    },
    onError: (e) => {
      if (e instanceof AxiosError && e.response?.status === 422) {
        setErrors(e.response.data.errors);
      }
    },
    onSuccess: () => {
      setShowSuccessMessage(true);
      intervalId.current = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    },
  });

  return (
    <S.Container>
      <Form
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          transaction(() => {
            intervalId.current = null;
            setShowSuccessMessage(false);
          });
          const formData = new FormData(e.currentTarget);
          const password = formData.get("password") + "";
          const password_old = formData.get("password_old") + "";
          const password_confirmation =
            formData.get("password_confirmation") + "";

          mutation.mutate({
            password,
            password_confirmation,
            password_old,
          });
        }}
      >
        <S.Text>{t("common.oldPassword")}</S.Text>
        <PasswordInput
          name="password_old"
          error={getError(errors?.password_old)}
        />
        <S.Text>{t("common.newPassword")}</S.Text>
        <PasswordInput name="password" error={getError(errors?.password)} />
        <S.Text>{t("common.confirmPassword")}</S.Text>
        <PasswordInput
          name="password_confirmation"
          error={getError(errors?.password_confirmation)}
        />
        <S.ButtonWrapper>
          <Button
            type="submit"
            loading={mutation.isLoading}
            style={{
              width: 224,
            }}
          >
            {t("account.changePassword.btnText")}
          </Button>
        </S.ButtonWrapper>

        {showSuccessMessage && (
          <p
            style={{
              marginTop: "10px",
              color: "green",
            }}
          >
            {t("account.changePassword.successMessage")}
          </p>
        )}
      </Form>
    </S.Container>
  );
});

export const Component = UpdatePasswordPage;
Object.assign(Component, {
  displayName: "LazyUpdatePasswordPage",
});
