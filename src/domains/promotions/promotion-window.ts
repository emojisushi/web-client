import { useSyncExternalStore } from "react";

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

// "HH:MM" now in Kyiv, the timezone promotion windows are set in
export const kyivTime = (date = new Date()) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Kyiv",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);

// One clock for every component, so the cart, the cart modal and the checkout
// form all re-render on the same tick and agree on which gifts are shown — the
// form sends exactly those with the order.
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  if (!timer) {
    timer = setInterval(() => listeners.forEach((l) => l()), 15 * 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
};

// "HH:MM" in Kyiv, updated within 15 seconds of the minute changing
export const useKyivTime = () => useSyncExternalStore(subscribe, kyivTime);

/**
 * Mirrors PromotionWindow on the backend: the end minute is excluded and a
 * window may pass midnight. Without a valid window the promotion runs all day.
 */
export const isWindowOpen = (
  from: string | null | undefined,
  to: string | null | undefined,
  time = kyivTime()
) => {
  if (!from || !to || !TIME.test(from) || !TIME.test(to) || from === to) {
    return true;
  }
  return from < to ? time >= from && time < to : time >= from || time < to;
};
