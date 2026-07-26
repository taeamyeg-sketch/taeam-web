"use client";

import { useEffect, useState } from "react";
import { X, ArrowRight, CheckCircle, ShieldCheck } from "@phosphor-icons/react";
import { useModalDialog } from "@/lib/useModalDialog";
import { submitWaitlist, alreadyJoined } from "@/lib/waitlist-submit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Global waitlist modal. Mounted once in the layout; opens on the
 * `taeam:waitlist` event (see openWaitlist), fired by the header CTA, the logo
 * hub menu, and the sub-page "join the waitlist" buttons. The home hero uses its
 * own inline field instead. Shares submitWaitlist so behaviour matches the hero.
 */
export function WaitlistModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("taeam:waitlist", onOpen);
    return () => window.removeEventListener("taeam:waitlist", onOpen);
  }, []);

  if (!open) return null;
  return <WaitlistDialog onClose={() => setOpen(false)} />;
}

type Result = "new" | "existing";

function WaitlistDialog({ onClose }: { onClose: () => void }) {
  const panelRef = useModalDialog<HTMLDivElement>(onClose);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailed, setEmailed] = useState(false);
  const [error, setError] = useState("");
  // If this device already joined, greet them with the "already in" state.
  const [result, setResult] = useState<Result | null>(() =>
    alreadyJoined() ? "existing" : null,
  );

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

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center">
      <button
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Join the Taeam waitlist"
        className="relative z-10 max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-t-3xl bg-cream p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-sheet sm:rounded-3xl sm:p-8"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2 top-2 p-3 text-ink-mute transition-colors hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>

        {result ? (
          <div className="pt-2 text-center">
            <CheckCircle className="mx-auto h-11 w-11 text-gold-deep" weight="fill" aria-hidden />
            <p className="mt-3 text-xl font-black uppercase tracking-tight text-ink">
              {result === "existing" ? "You're already in" : "You're on the list"}
            </p>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-mute">
              {result === "existing"
                ? "This email is already on the launch list. Your 50% off and 3,000 points are waiting for you the day we open."
                : emailed
                  ? "Your 50% off and 3,000 points are locked for launch day. Check your inbox for the details."
                  : "Your 50% off and 3,000 points are locked for launch day. We’ll email you the moment we open."}
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-noir px-6 py-3 text-sm font-bold uppercase tracking-wide text-gold-bright transition-transform hover:-translate-y-px"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-gold-deep">
              Join the waitlist
            </p>
            <h2 className="mt-1.5 text-2xl font-black uppercase leading-tight tracking-tight text-ink">
              50% off your first order
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-mute">
              Up to $10 off plus 3,000 points, added to your account when we launch in
              Edmonton. Leave your email and we’ll hold your spot.
            </p>
            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                disabled={submitting}
                autoComplete="email"
                autoFocus
                aria-label="Email address"
                className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-base text-ink outline-none transition-all placeholder:text-gray-400 focus:border-gold-bright focus:ring-2 focus:ring-gold-bright/30"
              />
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-1.5 rounded-full bg-noir px-6 py-3 text-sm font-bold uppercase tracking-wide text-gold-bright transition-transform hover:-translate-y-px active:scale-[0.98] disabled:opacity-70"
              >
                {submitting ? (
                  "Joining…"
                ) : (
                  <>
                    Join the waitlist
                    <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
                  </>
                )}
              </button>
            </form>
            {error && <p className="mt-2 text-xs font-semibold text-red">{error}</p>}
            <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-mute">
              <ShieldCheck className="h-3.5 w-3.5" weight="bold" aria-hidden /> No spam. One heads-up
              when we open.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
