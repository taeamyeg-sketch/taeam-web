"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { submitWaitlist } from "@/lib/waitlist-submit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pre-launch hero CTA with an INLINE email field. The home page keeps the field;
 * every other "join the waitlist" trigger (header, logo menu, sub-page CTAs)
 * opens the modal instead. Offer written on the noir side of the diagonal, light
 * text + shadows so it reads over the video without a card. Compact on phones,
 * full size from sm+. Shares submitWaitlist with the modal, so a repeat email or
 * a device that already joined lands on the "you're already in" state.
 */
export function HeroWaitlist() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<null | "new" | "existing">(null);
  const [emailed, setEmailed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) {
      setError("Enter a valid email.");
      return;
    }
    setSubmitting(true);
    setError("");
    const out = await submitWaitlist(clean);
    setSubmitting(false);
    if (out.status === "fail") {
      setError("Something went wrong. Please try again.");
      return;
    }
    if (out.status === "new") setEmailed(out.emailed);
    setResult(out.status);
  }

  if (result) {
    return (
      <div id="waitlist" className="w-full max-w-sm text-center">
        <CheckCircle
          className="mx-auto h-8 w-8 text-gold-bright sm:h-9 sm:w-9"
          weight="fill"
          aria-hidden
          style={{ filter: "drop-shadow(0 3px 14px rgba(0,0,0,0.7))" }}
        />
        <p
          className="mt-2 text-base font-black uppercase tracking-tight text-gold-bright sm:text-lg"
          style={{ textShadow: "0 2px 18px rgba(0,0,0,0.75)" }}
        >
          {result === "existing" ? "You're already in" : "You're on the list"}
        </p>
        <p
          className="mx-auto mt-1 max-w-xs text-xs leading-snug text-cream/90 sm:text-sm sm:leading-relaxed"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.8)" }}
        >
          {result === "existing"
            ? "This email is already on the list. Your 50% off and 3,000 points are waiting."
            : emailed
              ? "Your 50% off and 3,000 points are locked. Check your inbox for the details."
              : "Your 50% off and 3,000 points are locked for launch day."}
        </p>
      </div>
    );
  }

  return (
    <div id="waitlist" className="w-full max-w-md text-center">
      <p
        className="text-xl font-black uppercase leading-[1.05] tracking-tight text-gold-bright sm:text-3xl"
        style={{ textShadow: "0 4px 26px rgba(0,0,0,0.65)" }}
      >
        50% off your first order
      </p>
      <p
        className="mx-auto mt-1.5 max-w-xs text-xs leading-snug text-cream/90 sm:mt-2 sm:text-sm sm:leading-relaxed"
        style={{ textShadow: "0 2px 18px rgba(0,0,0,0.7)" }}
      >
        Up to $10 off plus 3,000 points when we launch in Edmonton.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-3 flex w-full flex-col gap-2 sm:mt-4 sm:flex-row"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          disabled={submitting}
          autoComplete="email"
          aria-label="Email address"
          className="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-base text-ink outline-none transition-all placeholder:text-gray-400 focus:border-gold-bright focus:ring-2 focus:ring-gold-bright/40 sm:py-3"
        />
        <button
          type="submit"
          disabled={submitting}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-gold-bright px-5 py-2.5 text-[13px] font-black uppercase tracking-wide text-noir shadow-[0_14px_36px_-12px_rgba(0,0,0,0.75)] transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 sm:px-6 sm:py-3 sm:text-sm"
        >
          {submitting ? (
            "Joining…"
          ) : (
            <>
              Join the list
              <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
            </>
          )}
        </button>
      </form>
      {error && (
        <p
          className="mt-2 text-xs font-bold text-red"
          style={{ textShadow: "0 1px 10px rgba(0,0,0,0.85)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
