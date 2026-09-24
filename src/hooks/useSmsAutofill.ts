import { useRef, useEffect } from "react";

export function useSmsAutoFill(
  setCode: (code: string) => void,
  phone: string,
  submit: (phone: string, code: string) => void
) {
  const phoneRef = useRef(phone);
  const submitRef = useRef(submit);
  phoneRef.current = phone;
  submitRef.current = submit;

  useEffect(() => {
    if (!("OTPCredential" in window)) return;

    const ac = new AbortController();

    navigator.credentials
      .get({
        // @ts-ignore
        otp: { transport: ["sms"] },
        signal: ac.signal,
      })
      .then((otp: any) => {
        if (otp?.code) {
          setCode(otp.code);
          submitRef.current(phoneRef.current, otp.code);
        }
      })
      .catch((err) => {
        console.warn("WebOTP cancelled or not available", err);
      });

    return () => {
      ac.abort();
    };
  }, []);
}
