import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { checkPhoneQuery } from "~domains/phone/checkPhone.query";
import { EmojisushiAgent } from "~lib/emojisushi-js-sdk";
import { useTranslation } from "react-i18next";
import { useSmsAutoFill } from "./useSmsAutofill";

interface PhoneStatusResponse {
  confirmed: boolean;
}

interface UseSmsVerificationProps {
  phone: string;
  city_slug: string;
  enabled?: boolean;
}

export const useSmsVerification = ({
  phone,
  city_slug,
  enabled = true,
}: UseSmsVerificationProps) => {
  const { t } = useTranslation();
  const [smsSent, setSmsSent] = useState(false);
  const [smsCode, setSmsCode] = useState("");
  const [smsVerified, setSmsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isCheckCodeButtonDisabled, setIsCheckCodeButtonDisabled] =
    useState(true);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const {
    data: phoneConfirmed,
    isLoading: isPhoneStatusLoading,
    refetch: refetchStatus,
  } = useQuery({
    ...checkPhoneQuery(phone),
    enabled: enabled && phone.length > 0,
    staleTime: 1000 * 60,
    retry: false,
  });

  const sendSmsMutation = useMutation({
    mutationFn: ({
      phone,
      city_slug,
    }: {
      phone: string;
      city_slug: string;
    }) => {
      return EmojisushiAgent.generateCode({
        phone,
        city_slug,
      });
    },
    onSuccess: () => {
      setTimer(75);
      setSmsSent(true);
      setError(null);
      setIsCheckCodeButtonDisabled(false);
    },
    onError: (err: any) => {
      setError(""); // cant send sms error
    },
    retry: false,
  });

  const verifySmsMutation = useMutation({
    mutationFn: ({ phone, smsCode }: { phone: string; smsCode: string }) => {
      return EmojisushiAgent.verifyCode({
        phone,
        code: smsCode,
      });
    },
    onSuccess: () => {
      setTimer(0);
      setSmsVerified(true);
      setError(null);
      refetchStatus();
    },
    onError: (err: any) => {
      setSmsVerified(false);
      setError(t("phone.code_error"));
    },
    retry: 1,
  });

  const sendSms = () => {
    if (timer > 0) return;
    sendSmsMutation.mutate({ phone, city_slug });
  };
  const verifySms = () => verifySmsMutation.mutate({ phone, smsCode });
  const verifySmsWithCode = (phone: string, code: string) => {
    verifySmsMutation.mutate({ phone, smsCode: code });
  };
  useSmsAutoFill(setSmsCode, phone, verifySmsWithCode);

  return {
    phoneConfirmed: phoneConfirmed?.confirmed,
    isPhoneStatusLoading,
    smsSent,
    smsCode,
    setSmsCode,
    smsVerified,
    error,
    setError,
    sendSms,
    verifySms,
    sendSmsLoading: sendSmsMutation.isPending,
    verifySmsLoading: verifySmsMutation.isPending,
    smsCooldown: timer,
    isCheckCodeButtonDisabled,
  };
};
