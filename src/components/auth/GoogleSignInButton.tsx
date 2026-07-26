"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * "Continue with Google" via Google Identity Services — the browser gets an
 * id-token which we hand to Supabase's signInWithIdToken. This is exactly how
 * taeam_app does Google (native id-token, nonce handshake), and it means there
 * is NO OAuth redirect — so the old "Google sends me to the admin site" bug
 * (a misconfigured Supabase Site URL) is impossible by construction.
 *
 * Renders Google's own button (the only GIS surface that reliably returns an
 * id-token from a click). If the client id is unset or the script fails, the
 * component renders nothing and the caller falls back to email.
 *
 * NOTE: the current origin (e.g. http://localhost:3000, https://taeam.ca) must
 * be listed under "Authorized JavaScript origins" for this OAuth client in
 * Google Cloud Console, or clicks fail with a GSI origin error.
 */

const GIS_SRC = "https://accounts.google.com/gsi/client";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID;

// Minimal shape of the GIS global we touch — avoids pulling in a types package.
interface GisId {
  initialize(opts: {
    client_id: string;
    callback: (resp: { credential?: string }) => void;
    nonce?: string;
    ux_mode?: "popup" | "redirect";
    auto_select?: boolean;
  }): void;
  renderButton(el: HTMLElement, opts: Record<string, unknown>): void;
}
declare global {
  interface Window {
    google?: { accounts?: { id?: GisId } };
  }
}

let scriptPromise: Promise<void> | null = null;
function loadGis(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("gis-load-failed"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/** Raw nonce (→ Supabase) + its SHA-256 hex (→ Google), matching taeam_app. */
async function makeNonce(): Promise<{ raw: string; hashed: string }> {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const raw = btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  const hashed = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { raw, hashed };
}

export function GoogleSignInButton({
  onCredential,
  disabled,
}: {
  /** Fires with the Google id-token and the raw nonce to pass to Supabase. */
  onCredential: (idToken: string, rawNonce: string) => void;
  disabled?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawNonceRef = useRef<string>("");
  const cbRef = useRef(onCredential);
  cbRef.current = onCredential;
  const [ok, setOk] = useState(true);

  const mount = useCallback(async () => {
    if (!CLIENT_ID) {
      setOk(false);
      return;
    }
    try {
      await loadGis();
      const { raw, hashed } = await makeNonce();
      const id = window.google?.accounts?.id;
      const el = containerRef.current;
      if (!id || !el) return;
      rawNonceRef.current = raw;
      id.initialize({
        client_id: CLIENT_ID,
        nonce: hashed,
        ux_mode: "popup",
        callback: (resp) => {
          if (resp?.credential) cbRef.current(resp.credential, rawNonceRef.current);
        },
      });
      el.innerHTML = "";
      const width = Math.min(400, Math.max(200, el.clientWidth || 280));
      id.renderButton(el, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        logo_alignment: "center",
        width,
      });
    } catch {
      setOk(false);
    }
  }, []);

  useEffect(() => {
    mount();
    // GIS renders a fixed-width iframe from a one-time measure; re-render it
    // when the container's width actually changes (rotation, resize).
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let last = el.clientWidth;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      if (w > 0 && Math.abs(w - last) > 24) {
        last = w;
        void mount();
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [mount]);

  if (!ok) return null;
  return (
    <div
      ref={containerRef}
      // GIS renders a light-scheme button; pin the color-scheme so it's legible
      // on the cream panel regardless of the visitor's OS theme.
      style={{ colorScheme: "light", minHeight: 44 }}
      className={`flex justify-center ${disabled ? "pointer-events-none opacity-60" : ""}`}
    />
  );
}
