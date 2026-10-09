"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Spam protection for the public waitlist forms (launch test plan B6 #46).
 *
 * Two layers, both rendered by `guard.fields` inside the <form>:
 *   1. A honeypot input named "website". People never see or reach it; naive
 *      bots fill every field. A filled honeypot short-circuits the submit.
 *   2. Cloudflare Turnstile, rendered "interaction-only", so a person normally
 *      sees nothing and only gets a checkbox when Cloudflare is unsure. The
 *      token goes to the backend, which verifies it before sending any mail.
 *
 * With NEXT_PUBLIC_TURNSTILE_SITE_KEY unset, the widget is not rendered and
 * `collect()` returns no token; the backend fails open until its own
 * TURNSTILE_SECRET_KEY is set, so the forms keep working before the keys exist.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
// How long a submit waits for an in-flight challenge before going ahead
// without a token (the backend then decides).
const TOKEN_WAIT_MS = 8000;

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi | null> | null = null;

function loadTurnstile(): Promise<TurnstileApi | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(window.turnstile ?? null);
    s.onerror = () => {
      scriptPromise = null; // allow a retry on the next mount
      resolve(null);
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export type BotProof = { turnstileToken?: string; honeypot: string };

export function useBotGuard() {
  const boxRef = useRef<HTMLDivElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const widgetId = useRef<string | null>(null);
  const token = useRef<string | undefined>(undefined);
  const waiters = useRef<Array<(t: string | undefined) => void>>([]);

  const settle = (t: string | undefined) => {
    token.current = t;
    const pending = waiters.current;
    waiters.current = [];
    pending.forEach((fn) => fn(t));
  };

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;
    loadTurnstile().then((api) => {
      if (cancelled || !api || !boxRef.current || widgetId.current) return;
      widgetId.current = api.render(boxRef.current, {
        sitekey: SITE_KEY,
        appearance: "interaction-only",
        action: "waitlist",
        callback: (t: string) => settle(t),
        "expired-callback": () => {
          token.current = undefined;
        },
        "error-callback": () => {
          settle(undefined);
          return true; // handled; no console noise from the widget
        },
      });
    });
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          /* already gone */
        }
      }
      widgetId.current = null;
    };
  }, []);

  /** Honeypot value plus a Turnstile token (waiting briefly if one is due). */
  const collect = useCallback(async (): Promise<BotProof> => {
    const honeypot = honeypotRef.current?.value ?? "";
    if (!SITE_KEY || !widgetId.current) return { honeypot };
    if (token.current) return { honeypot, turnstileToken: token.current };
    const t = await new Promise<string | undefined>((resolve) => {
      const timer = setTimeout(() => resolve(undefined), TOKEN_WAIT_MS);
      waiters.current.push((v) => {
        clearTimeout(timer);
        resolve(v);
      });
    });
    return { honeypot, turnstileToken: t };
  }, []);

  /** Tokens are single use: get a fresh one after every submit. */
  const reset = useCallback(() => {
    token.current = undefined;
    if (widgetId.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetId.current);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const fields = (
    <>
      {/* Honeypot: off-screen, unfocusable, unannounced. */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
      >
        <label>
          Website
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>
      {SITE_KEY ? <div ref={boxRef} className="mt-2 flex justify-center empty:hidden" /> : null}
    </>
  );

  return { fields, collect, reset };
}
