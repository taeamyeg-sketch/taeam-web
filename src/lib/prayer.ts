"use client";

import { useEffect, useState } from "react";

// Edmonton downtown — the fallback when we don't yet know the user's address.
const EDM_LAT = 53.5461;
const EDM_LNG = -113.4938;

export type PrayerTimings = Record<string, string>;

export interface PrayerData {
  timings: PrayerTimings | null;
  hijriMonth: number | null;
  isRamadan: boolean;
  loading: boolean;
  error: boolean;
}

// One in-flight fetch per (day, rounded coords) shared across every hook caller
// so the strip and the banner don't each hit Aladhan.
const cache = new Map<string, Promise<unknown>>();

const pad = (n: number) => String(n).padStart(2, "0");
const ddmmyyyy = (d: Date) =>
  `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;

/**
 * Live prayer times for a location via the free Aladhan API (ISNA method, the
 * North-American standard). Fails soft — callers just render nothing on error.
 */
export function usePrayerTimes(
  lat?: number | null,
  lng?: number | null,
): PrayerData {
  const [data, setData] = useState<PrayerData>({
    timings: null,
    hijriMonth: null,
    isRamadan: false,
    loading: true,
    error: false,
  });

  useEffect(() => {
    const la = lat ?? EDM_LAT;
    const ln = lng ?? EDM_LNG;
    const date = ddmmyyyy(new Date());
    const key = `${date}|${la.toFixed(2)}|${ln.toFixed(2)}`;
    let active = true;

    if (!cache.has(key)) {
      const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${la}&longitude=${ln}&method=2`;
      cache.set(
        key,
        fetch(url).then((r) => r.json()),
      );
    }

    setData((d) => ({ ...d, loading: true, error: false }));
    cache
      .get(key)!
      .then((json) => {
        if (!active) return;
        const payload = json as {
          data?: {
            timings?: PrayerTimings;
            date?: { hijri?: { month?: { number?: number } } };
          };
        };
        const timings = payload?.data?.timings ?? null;
        const hijriMonth = payload?.data?.date?.hijri?.month?.number ?? null;
        setData({
          timings,
          hijriMonth,
          isRamadan: hijriMonth === 9,
          loading: false,
          error: !timings,
        });
      })
      .catch(() => {
        if (active) setData((d) => ({ ...d, loading: false, error: true }));
      });

    return () => {
      active = false;
    };
  }, [lat, lng]);

  return data;
}

export const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

function toMin(hhmm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})/.exec(hhmm?.trim() ?? "");
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

export interface NextPrayer {
  name: string;
  minutesUntil: number;
  at: string;
}

/** The upcoming prayer and minutes until it, rolling to tomorrow's Fajr. */
export function computeNextPrayer(
  timings: PrayerTimings,
  now = new Date(),
): NextPrayer | null {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const list: { name: string; min: number }[] = [];
  for (const n of PRAYER_ORDER) {
    const min = toMin(timings[n]);
    if (min != null) list.push({ name: n, min });
  }
  if (!list.length) return null;

  for (const p of list) {
    if (p.min > nowMin)
      return { name: p.name, minutesUntil: p.min - nowMin, at: timings[p.name] };
  }
  const f = list[0]; // past Isha → tomorrow's Fajr
  return {
    name: f.name,
    minutesUntil: 24 * 60 - nowMin + f.min,
    at: timings[f.name],
  };
}

export function fmtCountdown(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** 24h "HH:MM" → "7:42 PM". */
export function to12h(hhmm: string): string {
  const mins = toMin(hhmm);
  if (mins == null) return hhmm;
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${ap}` : `${h12}:${pad(m)} ${ap}`;
}
