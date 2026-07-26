import type { Restaurant, RestaurantHours } from "./types";

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

/** Current weekday + minutes-since-midnight in Edmonton, wherever we render. */
function nowInEdmonton(): { day: (typeof DAYS)[number]; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Edmonton",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  const day = get("weekday").toLowerCase() as (typeof DAYS)[number];
  const hour = parseInt(get("hour"), 10) % 24;
  const minute = parseInt(get("minute"), 10);
  return { day, minutes: hour * 60 + minute };
}

function toMinutes(hhmm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

function to12h(hhmm: string): string {
  const mins = toMinutes(hhmm);
  if (mins === null) return hhmm;
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${ampm}` : `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export interface OpenStatus {
  open: boolean;
  /** e.g. "Open until 1 AM" · "Opens at 11 AM" · "Currently closed" */
  label: string;
}

/**
 * A restaurant is orderable only if the live flags say so; hours refine the
 * label. Some rows have open === close (data-entry noise) — those days are
 * treated as unknown and we fall back to the flags alone.
 */
export function openStatus(r: Restaurant): OpenStatus {
  const flagsOpen = r.is_open && r.accepting_orders;
  const today = todayWindow(r.hours);

  if (!today) {
    return flagsOpen
      ? { open: true, label: "Open now" }
      : { open: false, label: "Currently closed" };
  }

  const { minutes } = nowInEdmonton();
  const openM = today.openM;
  let closeM = today.closeM;
  const overnight = closeM <= openM; // e.g. 11:00 → 01:00
  if (overnight) closeM += 24 * 60;
  const nowM = overnight && minutes < openM ? minutes + 24 * 60 : minutes;

  const withinHours = nowM >= openM && nowM < closeM;

  if (flagsOpen && withinHours) {
    return { open: true, label: `Open until ${to12h(today.close)}` };
  }
  if (!withinHours && nowM < openM) {
    return { open: false, label: `Opens at ${to12h(today.open)}` };
  }
  return flagsOpen
    ? { open: true, label: "Open now" }
    : { open: false, label: "Currently closed" };
}

function todayWindow(hours: RestaurantHours | null) {
  if (!hours) return null;
  const { day } = nowInEdmonton();
  const win = hours[day];
  if (!win?.open || !win?.close) return null;
  const openM = toMinutes(win.open);
  const closeM = toMinutes(win.close);
  if (openM === null || closeM === null || openM === closeM) return null;
  return { open: win.open, close: win.close, openM, closeM };
}
