"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CaretDown,
  Storefront,
  Robot,
  SealCheck,
  Basket,
  Car,
  Coins,
  Gift,
  Info,
  EnvelopeSimple,
  type Icon,
} from "@phosphor-icons/react";
import { Eyebrow } from "@/components/Eyebrow";
import { cn } from "@/lib/cn";
import { SEALED, WAITLIST_HREF, isSealedPath } from "@/lib/launch";
import { openWaitlist } from "@/lib/waitlist-modal";

interface HubLink {
  href: string;
  label: string;
  desc: string;
  icon: Icon;
}

// The taeam.ca universe, surfaced from the logo. Order food first, then the
// surfaces that make Taeam more than a delivery app.
const HUB: HubLink[] = [
  { href: "/restaurants", label: "Order food", desc: "Halal kitchens near you", icon: Storefront },
  { href: "/arbaab", label: "Arbaab", desc: "Your food boss, by chat", icon: Robot },
  { href: "/halal", label: "The Halal Gap", desc: "Why we verify, not filter", icon: SealCheck },
  { href: "/fridge", label: "Taeam Fridge", desc: "Home kitchens, near you", icon: Basket },
  { href: "/drive", label: "Drive with Taeam", desc: "Earn on your schedule", icon: Car },
  { href: "/rewards", label: "Rewards & Plus", desc: "Points and flat delivery", icon: Coins },
  { href: "/refer", label: "Refer a friend", desc: "1,000 points each", icon: Gift },
  { href: "/about", label: "Our story", desc: "Halal made the whole point", icon: Info },
  { href: "/#contact", label: "Contact", desc: "Instagram or email us", icon: EnvelopeSimple },
];

// While sealed, drop the surfaces that need a live ordering account and lead
// with the waitlist instead of "Order food".
const WAITLIST_ITEM: HubLink = {
  href: WAITLIST_HREF,
  label: "Join the waitlist",
  desc: "50% off + 3,000 points at launch",
  icon: Gift,
};
const MENU_ITEMS: HubLink[] = SEALED
  ? [WAITLIST_ITEM, ...HUB.filter((item) => !isSealedPath(item.href))]
  : HUB;

/**
 * The logo doubles as the site's hub. Clicking it drops an animated panel with
 * every Taeam surface — the connective tissue that makes the site feel like a
 * home, not a bare ordering page. Cream panel in every context; the trigger
 * inverts white when floating over a dark hero.
 */
export function SiteMenu({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Taeam menu"
        className="group flex items-center gap-1 rounded-2xl px-2 py-1.5"
      >
        <Image
          src="/logo-mark.png"
          alt="Taeam"
          width={44}
          height={50}
          priority
          className={cn(
            "h-10 w-auto transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:scale-[1.06] group-active:scale-95",
            light && "invert",
          )}
        />
        <CaretDown
          weight="bold"
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            open ? "rotate-180" : "group-hover:translate-y-0.5",
            light ? "text-white/80" : "text-ink-mute",
          )}
        />
      </button>

      {/* Panel — kept mounted so it can animate both in and out */}
      <div
        className={cn(
          "absolute left-0 top-full z-50 mt-2 max-h-[calc(100dvh-6.5rem)] w-[min(92vw,520px)] origin-top-left overflow-y-auto overscroll-contain rounded-3xl border border-cream-line bg-cream p-3 shadow-card transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-2 scale-[0.97] opacity-0",
        )}
      >
        <div className="px-3 pb-2 pt-1">
          <Eyebrow>Explore Taeam</Eyebrow>
        </div>

        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {MENU_ITEMS.map((item, i) => {
            const rowClass = cn(
              "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-300",
              open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
              "hover:bg-cream-deep",
            );
            const style = { transitionDelay: open ? `${60 + i * 28}ms` : "0ms" };
            const inner = (
              <>
                <item.icon
                  weight="regular"
                  className="h-5 w-5 shrink-0 text-gold-deep transition-colors group-hover:text-ink"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-black uppercase tracking-tight text-ink">
                    {item.label}
                  </span>
                  <span className="block truncate text-xs text-ink-mute">
                    {item.desc}
                  </span>
                </span>
              </>
            );
            // The waitlist entry opens the modal instead of navigating.
            if (item.href === WAITLIST_HREF) {
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    setOpen(false);
                    openWaitlist();
                  }}
                  style={style}
                  className={cn(rowClass, "w-full")}
                >
                  {inner}
                </button>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={style}
                className={rowClass}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
