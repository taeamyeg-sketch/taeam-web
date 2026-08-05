"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Check, SignOut, Crown, ArrowRight } from "@phosphor-icons/react";
import { AccountShell } from "@/components/account/AccountShell";
import { useAuth } from "@/components/auth/AuthContext";
import { Rule } from "@/components/Pattern";

export default function AccountPage() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const points = profile?.taeam_points ?? 0;
  const pointsValue = (points / 1000).toFixed(2);

  async function copyReferral() {
    if (!profile?.referral_code) return;
    await navigator.clipboard.writeText(
      `https://taeam.ca/refer/${profile.referral_code}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <AccountShell>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Identity */}
        <div className="rounded-3xl bg-white/60 p-7 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-mute">
            Account
          </p>
          <h2 className="mt-2 font-black tracking-tight text-2xl text-ink">
            {profile?.name ?? "Salam!"}
          </h2>
          <p className="mt-1 break-words text-sm text-ink-mute">
            {profile?.email ?? user?.email}
          </p>
          {profile?.phone && (
            <p className="text-sm text-ink-mute">{profile.phone}</p>
          )}
          <button
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-cream-line px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-cream-deep"
          >
            <SignOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>

        {/* Points */}
        <div className="rounded-3xl bg-ink p-7 text-cream shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Taeam Points
          </p>
          <p className="mt-2 font-black tracking-tight text-4xl">
            {points.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-cream/70">
            {points >= 1000
              ? `Worth $${Math.floor(points / 1000)} off your next order · 1,000 points = $1`
              : "1,000 points = $1 off an order"}
          </p>
        </div>

        {/* Plus */}
        <div className="rounded-3xl bg-white/60 p-7 shadow-card">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep">
            <Crown className="h-4 w-4" aria-hidden /> Taeam Plus
          </p>
          {profile?.is_plus ? (
            <>
              <h2 className="mt-2 font-black uppercase tracking-tight text-2xl text-ink">
                You&rsquo;re a member.
              </h2>
              <p className="mt-1 text-sm text-ink-mute">
                Flat $2.99 delivery and a $0.99 service fee, applied
                automatically at checkout.
              </p>
            </>
          ) : (
            <>
              <h2 className="mt-2 font-black uppercase tracking-tight text-2xl text-ink">
                Not a member yet.
              </h2>
              <p className="mt-1 text-sm text-ink-mute">
                Join in the Taeam app, and your membership works here instantly.
              </p>
            </>
          )}
          <Link
            href="/account/subscription"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-gold-deep transition-colors hover:text-ink"
          >
            {profile?.is_plus ? "Manage membership" : "Get Taeam Plus"}
            <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
          </Link>
        </div>

        {/* Referral */}
        <div className="rounded-3xl bg-cream-deep p-7 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-mute">
            Refer &amp; earn
          </p>
          {profile?.referral_code ? (
            <>
              <p className="mt-2 font-black uppercase tracking-tight text-2xl text-ink">
                {profile.referral_code}
              </p>
              <p className="mt-1 text-sm text-ink-mute">
                Share your code. You both earn 1,000 points when their first
                order is $25 or more.
              </p>
              <button
                onClick={copyReferral}
                className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink"
              >
                {copied ? (
                  <Check className="h-4 w-4" aria-hidden />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden />
                )}
                {copied ? "Copied" : "Copy referral link"}
              </button>
            </>
          ) : (
            <p className="mt-2 text-sm text-ink-mute">
              Your referral code appears after your first order.
            </p>
          )}
        </div>
      </div>

      <p className="mt-10 flex items-center gap-2 text-xs text-ink-mute">
        <Rule className="w-4 text-gold" />
        Same account as the Taeam app, everything stays in sync.
      </p>
    </AccountShell>
  );
}
