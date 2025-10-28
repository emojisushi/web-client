import { useEffect, useState } from "react";

export function useSmsAutoFill(
  setCode: (code: string) => void,
  phone: string,
  submit: (phone: string, code: string) => void
) {
  useEffect(() => {
    if ("OTPCredential" in window) {
      const ac = new AbortController();
      navigator.credentials
        .get({
          // @ts-ignore
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((otp: any) => {
          if (otp && otp.code) {
            setCode(otp.code);
            submit(phone, otp.code);
          }
        })
        .catch((err) => {
          console.warn("WebOTP cancelled or not available", err);
        });

      return () => {
        ac.abort();
      };
    }
  }, [setCode, submit, phone]);
}
