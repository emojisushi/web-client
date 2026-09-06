import * as S from "./styled";
import { FormEventHandler, useState } from "react";
import {
  Input,
  Checkbox,
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "styled-components";
import { catalogQuery } from "~domains/catalog/catalog.query";
import { useMask, unformat } from "@react-input/mask";
import { useSmsVerification } from "~hooks/useSmsVerification";
import { citiesQuery } from "~domains/city/cities.query";
import { useCurrentCitySlug } from "~domains/city/hooks/useCurrentCitySlug";
import { isValidUkrainianPhone } from "~domains/order/utils";

const phoneMaskOptions = {
  mask: "+38(___) ___-__-__",
  replacement: { _: /\d/ },
  showMask: true,
  track: ({ inputType, data }) => {
    if (inputType === "insert") {
      if (data.startsWith("+38")) {
        data = data.slice(3);
      }
    }
    return data;
  },
};

export const RegisterModal = NiceModal.create(
  ({ redirect_to }: { redirect_to?: string }) => {
    const queryClient = useQueryClient();
    const theme = useTheme();
    const modal = useModal();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const phoneInputRef = useMask(phoneMaskOptions);

    const [phone, setPhone] = useState("+38");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [checked, setChecked] = useState(false);

    // false = phone/password step
    // true = OTP step
    const [smsStep, setSmsStep] = useState(false);

    const [errors, setErrors] = useState<{
      phone?: string[];
      password?: string[];
      code?: string[];
      agree?: string[];
    }>({});

    const register = useRegister();
    const registerWithSms = useRegister();

    const closeModal = () => {
      modal.remove();
    };
    const citySlug = useCurrentCitySlug();

    const { data: cities } = useQuery(citiesQuery);

    const city = (cities?.data || []).find((c) => c.slug === citySlug);
    const {
      sendSms,
      sendSmsLoading,
      smsCooldown,
      error: smsError,
      setError: setSmsError,
    } = useSmsVerification({
      phone: phone,
      city_slug: city?.slug ?? "",
    });

    /**
     * First step:
     * validate/register the phone and send OTP.
     */
    const handleSendCode = async () => {
      setErrors({});
      setSmsError("");

      if (!phone || phone === "+38") {
        setErrors({
          phone: [t("validation.required")],
        });
        return;
      }

      if (!password || password.length < 8) {
        setErrors({
          password: [t("validation.passwordMinLength")],
        });
        return;
      }

      if (!checked) {
        setErrors({
          agree: [t("validation.required")],
        });
        return;
      }
      if (!isValidUkrainianPhone(phone)) {
        setErrors({
          phone: [t("checkout.form.validation.phone.uk_format")],
        });
        return;
      }
      try {
        /*
         * If your backend needs to validate that the phone is
         * available for registration before sending SMS, this is
         * where you can call `register.mutateAsync(...)`.
         *
         * Otherwise just send the OTP here.
         */
        await sendSms();

        setSmsStep(true);
      } catch (err) {
        if (!axios.isAxiosError(err)) {
          return;
        }

        const error = err as AxiosError<{
          message?: string;
          errors?: Record<string, string[]>;
        }>;

        const serverErrors = error.response?.data?.errors;
        const message = error.response?.data?.message;

        if (serverErrors) {
          setErrors(serverErrors);
        } else if (message) {
          setErrors({
            phone: [message],
          });
        }
      }
    };

    /**
     * Second step:
     * register the account using phone + password + OTP.
     */
    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
      e.preventDefault();

      setErrors({});
      setSmsError("");

      registerWithSms.mutate(
        {
          phone: `+38${unformat(phone, phoneMaskOptions)}`,
          password,
          password_confirmation: password,
          code,
          agree: checked,
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
              message?: string;
              errors?: Record<string, string[]>;
            }>;

            const serverErrors = error.response?.data?.errors;
            const message = error.response?.data?.message;

            if (serverErrors) {
              setErrors(serverErrors);
            } else if (message) {
              setErrors({
                code: [message],
              });
            }
          },
        }
      );
    };

    const openSignIn = (e: React.MouseEvent) => {
      e.preventDefault();

      NiceModal.show(ModalIDEnum.AuthModal);
      NiceModal.hide(ModalIDEnum.RegisterModal);
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
                label={t("common.phone")}
                name="phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.currentTarget.value);
                  setErrors({});
                  setSmsError("");
                }}
                disabled={smsStep}
                error={errors.phone?.[0] || smsError}
                light={true}
                ref={phoneInputRef}
              />

              {!smsStep && (
                <>
                  <Input
                    label={t("common.password")}
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.currentTarget.value);
                      setErrors({});
                    }}
                    error={errors.password?.[0]}
                    light={true}
                    style={{
                      marginTop: 20,
                    }}
                  />

                  <S.CheckboxWrapper>
                    <Checkbox
                      checked={checked}
                      error={errors.agree?.[0]}
                      onChange={(e) => {
                        setChecked(e.target.checked);
                        setErrors({});
                      }}
                      name="agree"
                    >
                      {t("common.privacyPolicyAgreed")}
                    </Checkbox>
                  </S.CheckboxWrapper>

                  <FlexBox flexDirection="column">
                    <Button
                      style={{
                        justifySelf: "flex-end",
                        marginTop: "20px",
                        display: "flex",
                      }}
                      type="button"
                      loading={sendSmsLoading}
                      disabled={sendSmsLoading || smsCooldown > 0}
                      onClick={handleSendCode}
                    >
                      {smsCooldown > 0
                        ? `${t("phone.code_sent")} (${smsCooldown})`
                        : t("common.registration")}
                    </Button>

                    <TextButton
                      style={{ paddingTop: "10px", alignSelf: "flex-start" }}
                      onClick={openSignIn}
                    >
                      {t("common.enter")}
                    </TextButton>
                  </FlexBox>
                </>
              )}

              {smsStep && (
                <>
                  <Input
                    label={t("phone.enter_code")}
                    name="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(e) => {
                      setCode(e.currentTarget.value);
                      setErrors({});
                      setSmsError("");
                    }}
                    error={errors.code?.[0]}
                    light={true}
                    style={{
                      marginTop: 20,
                    }}
                  />

                  <FlexBox
                    flexDirection="column"
                    alignItems="center"
                    style={{ marginTop: "20px" }}
                  >
                    <FlexBox flexDirection="row" style={{ gap: 10 }}>
                      <Button
                        style={{
                          justifySelf: "flex-end",
                          display: "flex",
                        }}
                        type="button"
                        loading={sendSmsLoading}
                        disabled={sendSmsLoading || smsCooldown > 0}
                        onClick={handleSendCode}
                      >
                        {smsCooldown > 0
                          ? `${t("phone.code_sent")} (${smsCooldown})`
                          : t("phone.send_code")}
                      </Button>
                      <Button
                        type="submit"
                        loading={registerWithSms.isLoading}
                        disabled={registerWithSms.isLoading || !code}
                      >
                        {t("common.registration")}
                      </Button>
                    </FlexBox>
                    <TextButton
                      style={{ alignSelf: "flex-start", paddingTop: "10px" }}
                      type="button"
                      onClick={() => {
                        setSmsStep(false);
                        setCode("");
                        setErrors({});
                        setSmsError("");
                      }}
                    >
                      {t("common.back")}
                    </TextButton>
                  </FlexBox>
                </>
              )}
            </S.Form>
          </S.Wrapper>
        </ModalContent>
      </Modal>
    );
  }
);
