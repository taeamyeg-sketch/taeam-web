"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "@phosphor-icons/react";

const CONSENT_KEY = "taeam.cookie.consent";

/**
 * Slim cookie / local-storage consent notice, pinned bottom-center. Taeam uses
 * local storage for your saved address, cart, and (post-launch) session, so
 * this is a one-time acknowledgement, not a tracking wall. Accept once and it
 * never shows again. Mounted once in the root layout, on every page (consent
 * applies while the site is sealed too).
 */
export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false); // drives the slide-up

  useEffect(() => {
    let accepted = false;
    try {
      accepted = !!localStorage.getItem(CONSENT_KEY);
    } catch {
      accepted = false; // private mode — show it, harmless
    }
    if (accepted) return;
    setShow(true);
    // Let the page settle, then slide it up so it reads as a notice, not a wall.
    const t = setTimeout(() => setVisible(true), 450);
    return () => clearTimeout(t);
  }, []);

  function accept() {
    setVisible(false);
    try {
      localStorage.setItem(CONSENT_KEY, String(Date.now()));
    } catch {
      /* private mode — fine, it re-shows next session */
    }
    // Unmount after the slide-down finishes.
    setTimeout(() => setShow(false), 300);
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
      <div className="flex w-full max-w-2xl flex-col items-center gap-3 rounded-2xl border border-cream-line bg-cream/95 p-3.5 shadow-sheet backdrop-blur-md sm:flex-row sm:gap-4 sm:px-5">
        <Cookie
          className="hidden h-5 w-5 shrink-0 text-gold-deep sm:block"
          weight="fill"
          aria-hidden
        />
        <p className="text-center text-[13px] leading-snug text-ink-mute sm:flex-1 sm:text-left">
          We use cookies and local storage to keep Taeam working.{" "}
          <Link
            href="/cookies"
            className="font-semibold text-ink underline underline-offset-2 transition-colors hover:text-gold-deep"
          >
            View
          </Link>
        </p>
        <button
          onClick={accept}
          className="w-full shrink-0 rounded-full bg-noir px-6 py-2.5 text-[13px] font-bold uppercase tracking-wide text-gold-bright transition-transform hover:-translate-y-px active:scale-[0.98] sm:w-auto"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
