"use client";

import { useCallback, useRef, useState } from "react";
import { CircleNotch, AppleLogo } from "@phosphor-icons/react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import {
  sendEmailCode,
  identityExists,
  emailSession,
  linkGoogleProvider,
  AuthBackendError,
} from "@/lib/auth-backend";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { Khatam } from "@/components/Pattern";
import { cn } from "@/lib/cn";

/**
 * Passwordless sign-in on the SAME backend rail as taeam_app (no Supabase-Auth
 * email, no passwords). Email codes are 6-digit and delivered via Resend; the
 * backend mints the Supabase session. Google is a native id-token flow (no
 * redirect). PIN/phone are deliberately mobile-only — on web the browser
 * session persists, so a verified email code (or Google) is the whole login.
 *
 * Used by both the modal and the full-page /signin.
 */
export function AuthPanel({
  next = "/restaurants",
  onDone,
}: {
  next?: string;
  onDone?: () => void;
}) {
  void next; // routing is handled by the caller (modal closes / page pushes)
  const [mode, setMode] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  const friendly = (e: unknown, fallback: string) =>
    e instanceof AuthBackendError ? e.message : fallback;

  function appleComingSoon() {
    setError(null);
    setNotice("Apple sign-in is coming soon. Use email or Google for now.");
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const addr = email.trim().toLowerCase();
    try {
      // Send the code and figure out new-vs-returning in parallel. identityExists
      // never throws (returns true on failure), so only a send failure lands here.
      const [, exists] = await Promise.all([sendEmailCode(addr), identityExists(addr)]);
      setIsNewUser(!exists);
      setNotice(`We sent a 6-digit code to ${email.trim()}.`);
      setMode("code");
      setTimeout(() => codeRef.current?.focus(), 50);
    } catch (err) {
      setError(friendly(err, "Couldn't send the code. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { access_token, refresh_token } = await emailSession(
        email,
        code,
        isNewUser ? name : undefined,
      );
      const { error: sessErr } = await supabaseBrowser().auth.setSession({
        access_token,
        refresh_token,
      });
      if (sessErr) throw new Error(sessErr.message);
      onDone?.();
    } catch (err) {
      if (err instanceof AuthBackendError && err.status !== 0) {
        // 400/410/429 from the backend → the code itself was wrong/expired.
        setError(err.message || "That code didn't match. Check the newest email and try again.");
      } else {
        setError(friendly(err, "That code didn't match. Check the newest email and try again."));
      }
    } finally {
      setBusy(false);
    }
  }

  // Google id-token → Supabase session → best-effort profile link (mirrors app).
  const onGoogleCredential = useCallback(
    async (idToken: string, rawNonce: string) => {
      setBusy(true);
      setError(null);
      try {
        const { data, error: gErr } = await supabaseBrowser().auth.signInWithIdToken({
          provider: "google",
          token: idToken,
          nonce: rawNonce,
        });
        if (gErr) throw new Error(gErr.message);
        const session = data.session;
        if (session) {
          const u = session.user;
          const googleId =
            u.identities?.find((i) => i.provider === "google")?.id ??
            (u.user_metadata?.sub as string | undefined);
          await linkGoogleProvider(session.access_token, {
            google_id: googleId,
            name: (u.user_metadata?.full_name ?? u.user_metadata?.name) as string | undefined,
            email: u.email ?? undefined,
          });
        }
        onDone?.();
      } catch {
        setBusy(false);
        setError("Google sign-in didn't go through. Please try again, or use email.");
      }
    },
    [onDone],
  );

  const inputClass =
    "w-full rounded-xl border border-cream-line bg-cream px-4 py-3 text-base text-ink outline-none placeholder:text-ink-mute focus:border-gold";

  return (
    <div>
      <h1 className="text-2xl font-black uppercase tracking-tight text-ink">
        {mode === "code" ? "Check your email" : "Sign in or join"}
      </h1>
      <p className="mt-1.5 break-words text-sm leading-relaxed text-ink-mute">
        {mode === "code"
          ? notice
          : "Same account as the Taeam app. Your points and addresses come with you."}
      </p>

      {mode === "email" && (
        <>
          <div className="mt-6 space-y-2.5">
            <GoogleSignInButton onCredential={onGoogleCredential} disabled={busy} />
            <button
              type="button"
              onClick={appleComingSoon}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-cream transition-transform hover:-translate-y-px disabled:opacity-60"
            >
              <AppleLogo weight="fill" className="h-5 w-5" />
              Continue with Apple
            </button>
            {notice && mode === "email" && (
              <p className="text-center text-xs text-ink-mute">{notice}</p>
            )}
          </div>

          <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-ink-mute">
            <span className="h-px flex-1 bg-cream-line" />
            or
            <span className="h-px flex-1 bg-cream-line" />
          </div>

          <form onSubmit={sendCode} className="space-y-3">
            <input
              type="email"
              required
              autoComplete="email"
              aria-label="Email address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-[15px] font-bold uppercase tracking-wide text-ink transition-transform hover:-translate-y-px disabled:opacity-60"
            >
              {busy && <CircleNotch className="h-4 w-4 animate-spin" />}
              Email me a code
            </button>
          </form>
        </>
      )}

      {mode === "code" && (
        <form onSubmit={verify} className="mt-6 space-y-3">
          {isNewUser && (
            <input
              type="text"
              autoComplete="name"
              aria-label="Your name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          )}
          <input
            ref={codeRef}
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            aria-label="6-digit sign-in code"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className={cn(inputClass, "text-center text-xl tracking-[0.4em]")}
          />
          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-[15px] font-bold uppercase tracking-wide text-ink transition-transform hover:-translate-y-px disabled:opacity-60"
          >
            {busy && <CircleNotch className="h-4 w-4 animate-spin" />}
            Verify &amp; continue
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setNotice(null);
              setCode("");
              setMode("email");
            }}
            className="min-h-11 w-full pt-1 text-center text-sm font-medium text-ink-mute underline-offset-4 hover:text-ink hover:underline"
          >
            Use a different email
          </button>
        </form>
      )}

      {error && <p className="mt-4 text-sm font-medium text-red">{error}</p>}

      <p className="mt-6 flex items-center gap-2 text-xs text-ink-mute">
        <Khatam className="h-3 w-3 text-gold" strokeWidth={1.8} />
        Every kitchen on Taeam is halal. Verified, not filtered.
      </p>
    </div>
  );
}
