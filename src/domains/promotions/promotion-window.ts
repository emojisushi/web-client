import { useSyncExternalStore } from "react";

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const WEEKDAYS: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

// "N HH:MM" now in Kyiv — ISO week day (1 = Monday) and time — the timezone
// promotion schedules are set in. A string so it compares by value.
export const kyivNow = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Kyiv",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${WEEKDAYS[get("weekday") ?? "Mon"]} ${get("hour")}:${get("minute")}`;
};

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

// kyivNow(), updated within 15 seconds of the minute changing
export const useKyivTime = () => useSyncExternalStore(subscribe, kyivNow);

/**
 * Mirrors PromotionWindow on the backend: the end minute is excluded, a window
 * may pass midnight, and the hours after midnight belong to the day the window
 * started ("Fri 22:00-02:00" still applies at 01:00 on Saturday). No days means
 * every day, no valid window means all day.
 */
export const isWindowOpen = (
  from: string | null | undefined,
  to: string | null | undefined,
  days: number[] | null | undefined,
  now = kyivNow()
) => {
  const [dayPart, time] = now.split(" ");
  let day = Number(dayPart);
  const activeDays = (days ?? []).filter((d) => d >= 1 && d <= 7);
  const onDay = (d: number) =>
    activeDays.length === 0 || activeDays.includes(d);

  if (!from || !to || !TIME.test(from) || !TIME.test(to) || from === to) {
    return onDay(day);
  }

  let inside: boolean;
  if (from < to) {
    inside = time >= from && time < to;
  } else if (time >= from) {
    inside = true;
  } else if (time < to) {
    inside = true;
    // after midnight: the window opened the day before
    day = day === 1 ? 7 : day - 1;
  } else {
    inside = false;
  }

  return inside && onDay(day);
};
