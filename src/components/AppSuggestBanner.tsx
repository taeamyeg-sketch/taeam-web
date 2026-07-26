"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "@phosphor-icons/react";

/**
 * Mobile "get the app" nudge. The website is the PC/desktop surface; on a phone
 * the native apps are the better experience (live order tracking, saved spots,
 * push). This detects a phone browser and slides up a dismissible sheet pointing
 * to the right store. Desktop never sees it.
 *
 * Dismissal is remembered for a week so we nudge, not nag. Mounted once in the
 * root layout.
 */

const APP_STORE = "https://apps.apple.com/app/taeam";
const PLAY_STORE =
  "https://play.google.com/store/apps/details?id=com.taeam.taeam_app";
const DISMISS_KEY = "taeam.appsuggest.dismissed";
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000; // a week

type Platform = "ios" | "android" | null;

/** Coarse but reliable phone detection — UA for the store split, plus a width
 *  guard so tablets/desktops with touch don't trip it. */
function detectPhone(): Platform {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPod/.test(ua);
  // iPadOS reports as Mac; we intentionally target phones only, so no iPad.
  const isAndroidPhone = /Android/.test(ua) && /Mobile/.test(ua);
  if (window.innerWidth > 560) return null;
  if (isIOS) return "ios";
  if (isAndroidPhone) return "android";
  return null;
}

function recentlyDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return true; // legacy flag → treat as dismissed
    return Date.now() - ts < SNOOZE_MS;
  } catch {
    return false;
  }
}

export function AppSuggestBanner() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const p = detectPhone();
    if (!p || recentlyDismissed()) return;
    setPlatform(p);
    // Let the page settle before sliding up, so it reads as a nudge not a wall.
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* private mode — fine, it re-shows next session */
    }
  }

  if (!platform) return null;

  const storeUrl = platform === "ios" ? APP_STORE : PLAY_STORE;
  const storeName = platform === "ios" ? "App Store" : "Google Play";

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[80] pb-[env(safe-area-inset-bottom)] transition-transform duration-300 sm:hidden ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
      role="complementary"
      aria-label="Get the Taeam app"
      aria-hidden={!open}
      inert={!open || undefined}
    >
      <div className="mx-3 mb-3 overflow-hidden rounded-3xl border border-cream-line bg-cream shadow-sheet">
        <div className="h-1.5 w-full bg-gold" />
        <div className="flex items-center gap-3.5 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-noir">
            <Image
              src="/logo-mark.png"
              alt=""
              width={26}
              height={30}
              className="h-7 w-auto"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-black uppercase leading-tight tracking-tight text-ink">
              Taeam is better in the app
            </p>
            <p className="mt-0.5 text-[13px] leading-snug text-ink-mute">
              Live order tracking, saved spots, and halal kitchens in your
              pocket.
            </p>
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="-mr-2 -mt-2 shrink-0 self-start p-2.5 text-ink-mute transition-colors hover:text-ink"
          >
            <X className="h-5 w-5" weight="bold" />
          </button>
        </div>
        <div className="flex items-center gap-2 px-4 pb-4">
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="flex flex-1 items-center justify-center rounded-full bg-noir px-5 py-3 text-[13px] font-bold uppercase tracking-wide text-gold-bright transition-transform active:scale-[0.98]"
          >
            Get it on {storeName}
          </a>
          <button
            onClick={dismiss}
            className="shrink-0 rounded-full px-4 py-3 text-[13px] font-semibold text-ink-mute transition-colors hover:text-ink"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
