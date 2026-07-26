"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CaretLeft,
  CaretRight,
  ArrowRight,
  Crown,
  Coins,
  Gift,
  Moon,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

interface Promo {
  key: string;
  eyebrow: string;
  title: string;
  sub: string;
  cta: string;
  href: string;
  icon: Icon;
  tone: "noir" | "gold" | "cream" | "green";
}

const PLUS: Promo = {
  key: "plus",
  eyebrow: "Taeam Plus",
  title: "Flat $2.99 delivery",
  sub: "Members save on every kitchen, every order.",
  cta: "Get Taeam Plus",
  href: "/rewards",
  icon: Crown,
  tone: "noir",
};
const POINTS: Promo = {
  key: "points",
  eyebrow: "Taeam Points",
  title: "Every order earns",
  sub: "Points on everything. 1,000 points takes $1 off.",
  cta: "See rewards",
  href: "/rewards",
  icon: Coins,
  tone: "gold",
};
const REFER: Promo = {
  key: "refer",
  eyebrow: "Refer a friend",
  title: "You both get 1,000 points",
  sub: "After your friend's first order of $25 or more.",
  cta: "Invite friends",
  href: "/refer",
  icon: Gift,
  tone: "cream",
};
const IFTAR: Promo = {
  key: "iftar",
  eyebrow: "Ramadan",
  title: "Book your Iftar table",
  sub: "Reserve a spot to break your fast with us.",
  cta: "Reserve now",
  href: "/reserve",
  icon: Moon,
  tone: "green",
};

const TONES: Record<Promo["tone"], { bg: string; eyebrow: string; title: string; sub: string; cta: string }> = {
  noir: {
    bg: "bg-noir",
    eyebrow: "text-gold-bright",
    title: "text-cream",
    sub: "text-white/70",
    cta: "bg-gold text-ink",
  },
  gold: {
    bg: "bg-gold",
    eyebrow: "text-ink/70",
    title: "text-ink",
    sub: "text-ink/75",
    cta: "bg-ink text-cream",
  },
  cream: {
    bg: "bg-cream-deep",
    eyebrow: "text-gold-deep",
    title: "text-ink",
    sub: "text-ink-mute",
    cta: "bg-ink text-cream",
  },
  green: {
    bg: "bg-[#1B5E20]",
    eyebrow: "text-gold-bright",
    title: "text-white",
    sub: "text-white/75",
    cta: "bg-gold text-ink",
  },
};

/**
 * Rotating promo banner — the real offers Taeam already runs (Plus, Points,
 * Refer) plus the seasonal Iftar reservation during Ramadan. Auto-advances,
 * pauses on hover, and can be stepped by dots or arrows.
 */
export function PromoBanner({ ramadan = false }: { ramadan?: boolean }) {
  const slides = useMemo(
    () => (ramadan ? [IFTAR, PLUS, POINTS, REFER] : [PLUS, POINTS, REFER]),
    [ramadan],
  );
  const [raw, setRaw] = useState(0);
  const [paused, setPaused] = useState(false);
  const idx = raw % slides.length;

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(() => setRaw((x) => x + 1), 6000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  return (
    <div
      className="relative mt-2 h-32 overflow-hidden rounded-3xl sm:h-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {slides.map((p, i) => {
        const t = TONES[p.tone];
        const Glyph = p.icon;
        return (
          <Link
            key={p.key}
            href={p.href}
            aria-hidden={i !== idx}
            tabIndex={i === idx ? 0 : -1}
            className={cn(
              "group absolute inset-0 flex items-center justify-between gap-4 px-6 transition-opacity duration-700 sm:px-14",
              t.bg,
              i === idx ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <div className="min-w-0">
              <p className={cn("text-[11px] font-bold uppercase tracking-[0.2em]", t.eyebrow)}>
                {p.eyebrow}
              </p>
              <p className={cn("mt-1 text-lg font-black uppercase tracking-tight min-[400px]:text-xl sm:text-2xl", t.title)}>
                {p.title}
              </p>
              <p className={cn("mt-1 hidden text-sm sm:block", t.sub)}>{p.sub}</p>
              <span
                className={cn(
                  "mt-2 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide sm:mt-2.5",
                  t.cta,
                )}
              >
                {p.cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" weight="bold" />
              </span>
            </div>
            <Glyph
              weight="fill"
              aria-hidden
              className={cn("hidden h-14 w-14 shrink-0 opacity-90 sm:block sm:h-16 sm:w-16", t.eyebrow)}
            />
          </Link>
        );
      })}

      {slides.length > 1 && (
        <>
          <BannerArrow side="left" onClick={() => setRaw((x) => x + slides.length - 1)} />
          <BannerArrow side="right" onClick={() => setRaw((x) => x + 1)} />
          <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2">
            {slides.map((p, i) => (
              <button
                key={p.key}
                aria-label={`Go to ${p.eyebrow}`}
                onClick={() => setRaw(i)}
                className="p-2"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all",
                    i === idx ? "w-5 bg-ink/60" : "w-1.5 bg-ink/25",
                  )}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BannerArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Previous" : "Next"}
      className={cn(
        "absolute top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/35 sm:flex",
        side === "left" ? "left-2" : "right-2",
      )}
    >
      {side === "left" ? (
        <CaretLeft weight="bold" className="h-4 w-4" />
      ) : (
        <CaretRight weight="bold" className="h-4 w-4" />
      )}
    </button>
  );
}
