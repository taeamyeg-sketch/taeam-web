"use client";

import { useEffect, useRef, useState } from "react";
import { Mosque } from "@phosphor-icons/react";
import {
  usePrayerTimes,
  computeNextPrayer,
  fmtCountdown,
  to12h,
  PRAYER_ORDER,
} from "@/lib/prayer";
import { cn } from "@/lib/cn";

/**
 * Compact prayer indicator for the header — the spiritual anchor, tucked into
 * the top bar instead of a heavy banner. Shows the next prayer + countdown and
 * opens the full day's times on tap. Renders nothing until times resolve.
 */
export function PrayerChip({
  lat,
  lng,
  light = false,
}: {
  lat?: number | null;
  lng?: number | null;
  light?: boolean;
}) {
  const { timings } = usePrayerTimes(lat, lng);
  const [, setTick] = useState(0);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 20000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!timings) return null;
  const next = computeNextPrayer(timings);
  if (!next) return null;

  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Next prayer ${next.name} in ${fmtCountdown(next.minutesUntil)}`}
        className={cn(
          "inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
          light
            ? "text-white/90 hover:bg-white/10"
            : "text-ink-soft hover:bg-cream-deep",
        )}
      >
        <Mosque
          weight="fill"
          className={cn("h-4 w-4", light ? "text-gold-bright" : "text-gold-deep")}
        />
        <span className="hidden lg:inline">{next.name}</span>
        <span className={light ? "text-white" : "text-ink"}>
          {fmtCountdown(next.minutesUntil)}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-[calc(100dvh-6.5rem)] w-64 overflow-y-auto overscroll-contain rounded-2xl border border-cream-line bg-cream p-3 shadow-card">
          <p className="px-1 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute">
            Prayer times · Edmonton
          </p>
          <div className="space-y-0.5">
            {PRAYER_ORDER.map((name) => {
              const isNext = name === next.name;
              return (
                <div
                  key={name}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm",
                    isNext ? "bg-gold/15" : "",
                  )}
                >
                  <span
                    className={cn(
                      "font-semibold",
                      isNext ? "text-gold-deep" : "text-ink-soft",
                    )}
                  >
                    {name}
                  </span>
                  <span className={cn(isNext ? "font-bold text-ink" : "text-ink-mute")}>
                    {to12h(timings[name])}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
