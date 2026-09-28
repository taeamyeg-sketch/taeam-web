"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Cookie } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import {
  AD_TRACKING_DECLINED,
  COOKIE_CONSENT_KEY,
  revokeAdTracking,
} from "@/lib/meta-pixel";

const REOPEN_EVENT = "taeam:cookie-choices";

/**
 * Forget the stored answer and show the notice again. Used by the footer's
 * "Cookie choices" link and the /cookies page. Clearing the key puts the
 * visitor back on the default (pixel on) until they pick again, same as a
 * first visit.
 */
export function openCookieChoices() {
  try {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
  } catch {
    /* private mode — nothing stored to forget */
  }
  window.dispatchEvent(new CustomEvent(REOPEN_EVENT));
}

/** Plain text button that reopens the notice. Styled by the caller as a link. */
export function CookieChoicesButton({
  className,
  children = "Cookie choices",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={openCookieChoices}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </button>
  );
}

/**
 * Slim cookie notice, pinned bottom-center. Taeam uses local storage for your
 * saved address, cart, and (post-launch) session, and runs the Meta pixel to
 * measure ads. Opt-out model: the pixel runs until the visitor presses "No ad
 * tracking", which stores "declined" and revokes it (see lib/meta-pixel). "OK"
 * stores a timestamp. Either answer hides the notice until "Cookie choices"
 * clears it. Mounted once in the root layout, on every page (it applies while
 * the site is sealed too).
 */
export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false); // drives the slide-up
  const panelRef = useRef<HTMLDivElement>(null);
  // Set when "Cookie choices" reopens the notice: focus moves into it, then
  // back to that link once an answer is picked.
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let decided = false;
    try {
      decided = !!localStorage.getItem(COOKIE_CONSENT_KEY);
    } catch {
      decided = false; // private mode — show it, harmless
    }
    let t: ReturnType<typeof setTimeout> | undefined;
    // Mount it, then slide it up a beat later so the transition starts from
    // the hidden position.
    const present = (delay: number) => {
      clearTimeout(t);
      t = setTimeout(() => {
        setShow(true);
        t = setTimeout(() => setVisible(true), 50);
      }, delay);
    };
    // Let the page settle first, so it reads as a notice, not a wall.
    if (!decided) present(400);

    const reopen = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      present(0);
    };
    window.addEventListener(REOPEN_EVENT, reopen);
    return () => {
      clearTimeout(t);
      window.removeEventListener(REOPEN_EVENT, reopen);
    };
  }, []);

  useEffect(() => {
    if (visible && returnFocus.current) panelRef.current?.focus();
  }, [visible]);

  function answer(value: string) {
    setVisible(false);
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
      /* private mode — fine, it re-shows next session */
    }
    // Unmount after the slide-down finishes.
    setTimeout(() => {
      setShow(false);
      returnFocus.current?.focus();
      returnFocus.current = null;
    }, 300);
  }

  function decline() {
    revokeAdTracking();
    answer(AD_TRACKING_DECLINED);
  }

  // If this same page had already revoked the pixel, "OK" does not grant it
  // back here: a grant would flush every call fbevents.js queued while revoked.
  // The pixel resumes on the next page load instead.
  function accept() {
    answer(String(Date.now()));
  }

  if (!show) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[90] flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-[130%]"
      }`}
      role="region"
      aria-label="Cookie notice"
      aria-hidden={!visible}
      inert={!visible || undefined}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="flex w-full max-w-2xl flex-col items-center gap-3 rounded-xl border border-cream-line bg-cream p-3.5 shadow-sheet sm:flex-row sm:gap-4 sm:px-5"
      >
        <Cookie
          className="hidden h-5 w-5 shrink-0 text-gold-deep sm:block"
          weight="fill"
          aria-hidden
        />
        <p className="text-center text-[13px] leading-snug text-ink-mute sm:flex-1 sm:text-left">
          We use cookies to keep Taeam working, and a Meta pixel to measure our
          ads.{" "}
          <Link
            href="/cookies"
            className="font-semibold text-ink underline underline-offset-2 transition-colors hover:text-gold-deep"
          >
            Details
          </Link>
        </p>
        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          <button
            type="button"
            onClick={decline}
            className="flex-1 rounded-full border border-ink/25 px-4 py-2.5 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink sm:flex-none sm:px-5"
          >
            No ad tracking
          </button>
          <button
            type="button"
            onClick={accept}
            className="flex-1 rounded-full bg-noir px-6 py-2.5 text-[13px] font-bold uppercase tracking-wide text-gold sm:flex-none"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
