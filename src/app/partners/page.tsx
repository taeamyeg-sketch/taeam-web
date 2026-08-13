import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { Seal } from "@/components/Pattern";

/**
 * Founding-restaurant offer. Reached only by scanning the QR on the printed
 * partner sheet: unlinked from the header, the hub menu and the footer, kept
 * out of sitemap.ts, disallowed in robots.ts, and noindex here. A restaurant
 * that lands on it can still browse the rest of taeam.ca normally.
 */
export const metadata: Metadata = {
  title: "Partner with Taeam",
  description:
    "Founding restaurant partners in Edmonton pay 12% for three months, then 15% or 17%. Weekly payouts, no hardware, no exclusivity, and halal verification the customer can actually read.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Partner with Taeam · Founding restaurants",
    description:
      "12% for your first three months. Weekly payouts, no upfront cost, and a halal verification customers can read on your page.",
    type: "article",
    url: "https://taeam.ca/partners",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Partner with Taeam",
      },
    ],
  },
};

/** Mirrors the printed founding-partner sheet, in the same order. */
const VERIFY = [
  {
    title: "The certifying body",
    copy: "Which body certifies your supplier (HMA, CHFCA, HMO) and what that standard permits.",
  },
  {
    title: "Your supplier of record",
    copy: "Named and dated in your file, for our verification only.",
  },
  {
    title: "A signed attestation",
    copy: "One page confirming what is on file is accurate. A statement, not an audit.",
  },
  {
    title: "What the customer sees",
    copy: "The certifying body and the date we verified it, on the page where they decide.",
  },
];

// Rates are the live values in public.config → commission_rates. If that row
// changes, this table changes with it, and so does the printed sheet.
const RATES = [
  { label: "Uber Eats, SkipTheDishes, DoorDash", rate: "20–30%", tone: "them" },
  { label: "Your first three months on Taeam", rate: "12%", tone: "key" },
  { label: "From month four, 100+ orders a month", rate: "15%", tone: "us" },
  { label: "From month four, below 100", rate: "17%", tone: "us" },
] as const;

const PAID = [
  {
    title: "Every week, automatically",
    copy: "We settle Sunday night and the transfer lands in your bank in one to three business days. No invoicing, no chasing us for it.",
  },
  {
    title: "Refunds split by fault",
    copy: "Our mistake or the driver's, you keep your money. A kitchen mistake costs you 70% of it, and we absorb the rest rather than passing the whole ticket back.",
  },
];

const NEEDS = [
  {
    title: "Your menu",
    copy: "A photo or a PDF is fine. We build the page, the prices and the photos.",
  },
  {
    title: "Your supplier",
    copy: "Their name, and a copy of the halal certificate you already keep.",
  },
  {
    title: "Twenty minutes",
    copy: "One signature, one test order through the kitchen, and you are live.",
  },
];

/**
 * The questions owners actually ask, in the order they ask them. Every number
 * here is the one the platform bills on, so it moves with
 * config.commission_rates and lib/commission.js. See the migration
 * 20260812_01_founding_rate_3_months_volume_100.sql before editing any of it.
 */
const ANSWERS = [
  {
    q: "Are there any other fees?",
    a: "No. The commission is the only thing we take. No processing or transaction fees, no monthly fee, no setup cost, and nothing for the menu page and photos we build for you.",
  },
  {
    q: "Is the 12% permanent?",
    a: "It runs for your first three months. After that it is 15% if you are doing 100 or more orders a month, and 17% below that. If you want a longer founding term, say so and we will talk about it.",
  },
  {
    q: "Is there a contract or exclusivity?",
    a: "Neither. Stay on every other platform you are on. There is no minimum term and no cancellation fee, so you can leave whenever you want.",
  },
  {
    q: "How often do we get paid?",
    a: "Every week. We settle Sunday night and the transfer lands in your bank in one to three business days, with the order by order breakdown behind it.",
  },
  {
    q: "Who handles the drivers?",
    a: "We do. Taeam recruits, manages and pays the drivers, and dispatches them to your door. You cook and hand off the order. Nothing else changes in your kitchen.",
  },
  {
    q: "What happens with refunds and complaints?",
    a: "We split them by fault. If the mistake is ours or the driver's, you keep your money in full. If it is a kitchen error, it costs you 70% of the refund and we absorb the rest. We handle the customer either way.",
  },
  {
    q: "Can we set our own prices?",
    a: "Yes, and you can change them yourself at any time. We do not mark up your menu, and we do not ask you to charge more on Taeam than you do in the restaurant.",
  },
  {
    q: "Who pays for promotions?",
    a: "We do. When a customer uses a promo code or a deal, you are still paid on your full menu price. The discount comes off our side, not yours.",
  },
  {
    q: "What area do you deliver to?",
    a: "Edmonton, up to 15 km from your kitchen. From most locations that covers most of the city.",
  },
  {
    q: "Are you in other cities?",
    a: "Not yet. Edmonton is our first launch and our only focus until it works properly here.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <Header overlay overlayTone="dark" />

      {/* ── Dark brand island: the claim, with the kitchen behind it ── */}
      <section className="grain relative isolate overflow-hidden bg-noir pb-20 pt-32 text-white sm:pb-24 sm:pt-40">
        <Image
          src="/partners-kitchen.webp"
          alt="A cook plating an order on the pass of a small halal restaurant kitchen in the evening"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[62%_22%] opacity-40"
        />
        <span
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-noir via-noir/85 to-noir/30"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rise" style={{ animationDelay: "60ms" }}>
            <Eyebrow tone="bright">Founding partner · Edmonton</Eyebrow>
            <h1 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
              You already pay more for halal.{" "}
              <span className="text-gold-bright">
                No delivery app makes it worth anything.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              On every platform, a kitchen that sources properly certified meat
              sits beside one that typed the word into a form. Same badge, same
              rank. Taeam is built to tell those apart, and to charge you less
              for the privilege.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href="tel:+15874150019"
                className="rounded-full bg-gold-bright px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-noir transition-transform hover:-translate-y-0.5"
              >
                Call 587-415-0019
              </a>
              <a
                href="mailto:restaurants@taeam.ca?subject=Founding%20partner%20%E2%80%94%20my%20restaurant"
                className="group inline-flex items-center gap-1 text-sm font-semibold text-white/80 transition-colors hover:text-gold-bright"
              >
                restaurants@taeam.ca
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── The money. First thing an owner wants, so it goes first. ── */}
      <section className="bg-cream-deep py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <Eyebrow>What you pay</Eyebrow>
            <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
              One number, no asterisk.
            </h2>
          </Reveal>

          <Reveal delay={90}>
            <div className="mt-10 overflow-hidden rounded-3xl border border-cream-line bg-cream shadow-card">
              {RATES.map((row) => (
                <div
                  key={row.label}
                  className={`flex items-baseline justify-between gap-6 border-b border-cream-line px-6 py-5 last:border-b-0 sm:px-8 ${
                    row.tone === "key" ? "bg-cream-deep/60" : ""
                  }`}
                >
                  <span
                    className={
                      row.tone === "them"
                        ? "text-sm leading-snug text-ink-mute sm:text-base"
                        : "text-sm font-bold leading-snug text-ink sm:text-base"
                    }
                  >
                    {row.label}
                  </span>
                  <span
                    className={
                      row.tone === "key"
                        ? "shrink-0 text-4xl font-black tracking-tight text-gold-deep sm:text-5xl"
                        : row.tone === "them"
                          ? "shrink-0 text-base font-semibold tabular-nums text-ink-mute"
                          : "shrink-0 text-base font-bold tabular-nums text-ink"
                    }
                  >
                    {row.rate}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-5 flex flex-col gap-3 text-sm text-ink-mute sm:flex-row sm:items-center sm:justify-between">
              <span>
                The commission is the only thing we take. No processing fees, no
                monthly fee, and we review your volume with you before your rate
                changes.
              </span>
              <span className="shrink-0 font-semibold text-ink">
                No upfront cost · No hardware · No exclusivity · Cancel anytime
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── What the verification actually is ── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <Eyebrow>What we verify</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
            We check the paperwork you already keep.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div className="space-y-8">
            {VERIFY.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 90}>
                <div className="grid gap-4 border-t border-cream-line pt-7 sm:grid-cols-[auto_1fr] sm:gap-8">
                  <span className="text-4xl font-black tracking-tight text-gold-deep sm:w-16 sm:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-2xl leading-relaxed text-ink-mute">
                      {item.copy}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="rounded-3xl bg-noir p-7 text-white lg:sticky lg:top-24">
              <div className="mb-4 flex items-center gap-2">
                <Seal className="h-4 w-4 text-gold-bright" />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
                  Your supplier stays yours
                </span>
              </div>
              <p className="leading-relaxed text-white/70">
                Your supplier is never published in the app and never shared
                with another restaurant. Sourcing and pricing stay yours. What
                the customer sees is the certifying body and the date we
                verified it, nothing else.
              </p>
              <p className="mt-5 text-xs leading-relaxed text-white/40">
                The attestation is a statement, not an audit. You are confirming
                what is already on file is accurate.
              </p>
              <Link
                href="/how-we-verify"
                className="group mt-6 inline-flex items-center gap-1 text-sm font-semibold text-gold-bright"
              >
                The full verification process
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Payouts and refunds: the second question, always ── */}
      <section className="grain relative overflow-hidden bg-noir py-20 text-white sm:py-28">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <Eyebrow tone="bright">How you get paid</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
              Weekly, and we tell you the split.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {PAID.map((card, i) => (
              <Reveal key={card.title} delay={i * 90}>
                <div className="h-full rounded-3xl border border-noir-line bg-noir-soft p-8">
                  <h3 className="font-semibold text-gold-bright">
                    {card.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-white/70">
                    {card.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── What onboarding costs the owner in effort ── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <Eyebrow>What we need from you</Eyebrow>
          <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
            Three things.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEEDS.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 90}>
              <div className="h-full rounded-3xl border border-cream-line bg-cream p-7 shadow-card">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-gold-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2.5 text-lg font-black uppercase tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">
                  {item.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── The ten questions every owner asks, answered in full ── */}
      <section id="questions" className="scroll-mt-24 bg-cream-deep py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <Eyebrow>Straight answers</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
              Everything owners ask us before signing.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-mute">
              If something here is not clear, call and ask. We would rather
              answer it now than have you find out later.
            </p>
          </Reveal>

          <dl className="mt-12 grid gap-x-12 gap-y-9 md:grid-cols-2">
            {ANSWERS.map((item, i) => (
              <Reveal key={item.q} delay={(i % 2) * 90}>
                <div className="border-t border-cream-line pt-6">
                  <dt className="text-lg font-black uppercase leading-snug tracking-tight text-ink">
                    {item.q}
                  </dt>
                  <dd className="mt-2 leading-relaxed text-ink-mute">
                    {item.a}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Reveal>
          <div className="rounded-3xl bg-cream-deep px-6 py-14 sm:py-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
              Launching October 15, 2026.
            </h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-mute">
              Founding rates are for the kitchens that open with us. Call and we
              will walk your menu together.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              <a
                href="tel:+15874150019"
                className="rounded-full bg-gold-bright px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-noir transition-transform hover:-translate-y-0.5"
              >
                Call 587-415-0019
              </a>
              <a
                href="mailto:restaurants@taeam.ca?subject=Founding%20partner%20%E2%80%94%20my%20restaurant"
                className="group inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-gold-deep"
              >
                restaurants@taeam.ca
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
            <p className="mt-8 text-xs uppercase tracking-[0.14em] text-ink-mute">
              Taeam Technologies Inc. · Edmonton, Alberta
            </p>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
