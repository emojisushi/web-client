import * as S from "./styled";
import { FormEventHandler, useState } from "react";
import {
  Input,
  Modal,
  ModalContent,
  ModalCloseButton,
  FlexBox,
} from "~components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios, { AxiosError } from "axios";
import { cartQuery } from "~domains/cart/cart.query";
import { isValidUkrainianPhone } from "~domains/order/utils";

import NiceModal from "@ebay/nice-modal-react";
import { ROUTES } from "~routes";
import { useModal } from "~modal";
import { ModalIDEnum } from "~common/modal.constants";
import { TextButton } from "~common/ui-components/TextButton";
import { Button } from "~common/ui-components/Button/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { catalogQuery } from "~domains/catalog/catalog.query";
import { useSmsVerification } from "~hooks/useSmsVerification";
import { citiesQuery } from "~domains/city/cities.query";
import { useCurrentCitySlug } from "~domains/city/hooks/useCurrentCitySlug";
import { useMask, unformat } from "@react-input/mask";

import { useLogin } from "~hooks/use-auth";

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

export const AuthModal = NiceModal.create(
  ({ redirect_to }: { redirect_to?: string }) => {
    const citySlug = useCurrentCitySlug();

    const { data: cities } = useQuery(citiesQuery);

    const city = (cities?.data || []).find((c) => c.slug === citySlug);

    const modal = useModal();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const phoneInputRef = useMask(phoneMaskOptions);

    const [phone, setPhone] = useState("+38");
    const [code, setCode] = useState("");

    const [smsStep, setSmsStep] = useState(false);

    const [errors, setErrors] = useState<{
      phone?: string[];
      code?: string[];
    }>({});

    const loginWithSms = useLogin();

    const closeModal = () => {
      modal.remove();
    };

    const {
      sendSms,
      sendSmsLoading,
      smsCooldown,
      error: smsError,
      setError: setSmsError,
    } = useSmsVerification({
      phone,
      city_slug: city?.slug ?? "",
    });

    const handleSendSms = async () => {
      setErrors({});
      setSmsError("");
      if (!isValidUkrainianPhone(phone)) {
        setErrors({
          phone: [t("checkout.form.validation.phone.uk_format")],
        });
        return;
      }

      try {
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

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
      e.preventDefault();

      setErrors({});
      setSmsError("");

      loginWithSms.mutate(
        {
          phone: unformat(phone, phoneMaskOptions),
          code,
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

    const openSignupModal = (e: React.MouseEvent) => {
      e.preventDefault();

      NiceModal.show(ModalIDEnum.RegisterModal);
      NiceModal.hide(ModalIDEnum.AuthModal);
    };

    const openResetPasswordModal = (e: React.MouseEvent) => {
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
                label={t("common.phone")}
                name="phone"
                type="tel"
                inputMode="tel"
                value={phone}
                error={errors.phone?.[0] || smsError}
                disabled={smsStep}
                light={true}
                ref={phoneInputRef}
                onChange={(e) => {
                  setPhone(e.currentTarget.value);
                  setErrors({});
                  setSmsError("");
                }}
              />

              {!smsStep ? (
                <>
                  <Button
                    type="button"
                    loading={sendSmsLoading}
                    disabled={sendSmsLoading || smsCooldown > 0}
                    onClick={handleSendSms}
                    style={{
                      justifySelf: "flex-end",
                      marginTop: "20px",
                      display: "flex",
                    }}
                  >
                    {smsCooldown > 0
                      ? `${t("phone.code_sent")} (${smsCooldown})`
                      : t("phone.send_code")}
                  </Button>

                  <TextButton
                    style={{ paddingTop: "10px" }}
                    onClick={openSignupModal}
                  >
                    {t("common.registration")}
                  </TextButton>

                  {/* <TextButton
                    style={{ paddingTop: "10px" }}
                    onClick={openResetPasswordModal}
                  >
                    {t("common.forgotPassword")}
                  </TextButton> */}
                </>
              ) : (
                <>
                  <Input
                    label={t("phone.enter_code")}
                    name="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    error={errors.code?.[0]}
                    light={true}
                    style={{
                      marginTop: "20px",
                    }}
                    onChange={(e) => {
                      setCode(e.currentTarget.value);
                      setErrors({});
                    }}
                  />
                  <FlexBox
                    flexDirection="row"
                    style={{ gap: 10, marginTop: 20 }}
                  >
                    <Button
                      style={{
                        justifySelf: "flex-end",
                        display: "flex",
                      }}
                      type="button"
                      loading={sendSmsLoading}
                      disabled={sendSmsLoading || smsCooldown > 0}
                      onClick={handleSendSms}
                    >
                      {smsCooldown > 0
                        ? `${t("phone.code_sent")} (${smsCooldown})`
                        : t("phone.send_code")}
                    </Button>
                    <Button
                      loading={loginWithSms.isLoading}
                      disabled={loginWithSms.isLoading || !code}
                      type="submit"
                      style={{
                        justifySelf: "flex-end",
                        display: "flex",
                      }}
                    >
                      {t("common.login")}
                    </Button>
                  </FlexBox>
                  <TextButton
                    type="button"
                    style={{ paddingTop: "10px" }}
                    onClick={() => {
                      setSmsStep(false);
                      setCode("");
                      setErrors({});
                      setSmsError("");
                    }}
                  >
                    {t("common.back")}
                  </TextButton>

                  <TextButton
                    type="button"
                    style={{ paddingTop: "10px" }}
                    onClick={openSignupModal}
                  >
                    {t("common.registration")}
                  </TextButton>
                </>
              )}
            </S.Form>
          </S.Wrapper>
        </ModalContent>
      </Modal>
    );
  }
);
