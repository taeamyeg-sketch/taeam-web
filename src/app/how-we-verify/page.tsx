import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { TransitionLink } from "@/components/transition/PageTransition";
import { Khatam } from "@/components/Pattern";
import { SEALED, orderHref } from "@/lib/launch";
import { JoinWaitlistButton } from "@/components/JoinWaitlistButton";

export const metadata: Metadata = {
  title: "How we verify halal",
  description:
    "Every kitchen on Taeam is audited before it opens: supplier checks, direct contact, slaughter method pinned down per protein, and zero tolerance for cross contamination.",
  openGraph: {
    title: "How we verify halal · Taeam",
    description:
      "Supplier checks, direct contact, the slaughter method pinned down per protein. How every kitchen earns the Taeam Verified mark.",
    type: "article",
    url: "https://taeam.ca/how-we-verify",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Taeam, how we verify halal",
      },
    ],
  },
};

const STEPS = [
  {
    title: "The supplier file",
    copy: "Before a kitchen goes live, it hands us its meat supplier information. That file is where the audit starts. No supplier info, no listing.",
  },
  {
    title: "We contact the supplier",
    copy: "We research the supplier ourselves and reach out directly. A photocopy of a certificate is not enough. We want the details from the source.",
  },
  {
    title: "We pin down the method",
    copy: "Hand or machine. Stunned or not stunned. We keep digging until we can state the method for every protein the kitchen serves.",
  },
  {
    title: "We audit the kitchen",
    copy: "A small on-site audit of the restaurant itself: sourcing, storage, and prep. If anything is off, the kitchen does not go live.",
  },
  {
    title: "Certified, in two places",
    copy: "The restaurant earns a Taeam certification for its wall, and the same verification shows in the app, right on the menu page where you order.",
  },
];

const HARD_LINES = [
  {
    title: "No partial halal",
    copy: "If any part of a menu is not halal, the restaurant does not get on Taeam. We do not list halal sections, halal corners, or halal on request.",
  },
  {
    title: "No cross contamination",
    copy: "Shared fryers, shared grills, shared prep with non-halal food: refused. If the kitchen cannot keep it separate, it does not open here.",
  },
  {
    title: "No alcohol on the premises",
    copy: "Not served, not stored, not sold. The same rule for every kitchen on Taeam, from day one.",
  },
];

export default function HowWeVerifyPage() {
  return (
    <>
      <Header overlay overlayTone="dark" />

      {/* ── Dark brand island: the claim ── */}
      <section className="grain relative overflow-hidden bg-noir pb-20 pt-32 text-white sm:pb-24 sm:pt-40">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rise" style={{ animationDelay: "60ms" }}>
            <Eyebrow tone="bright">Taeam Verified</Eyebrow>
            <h1 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
              Audited, <span className="text-gold-bright">then listed.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              We do not take a label&apos;s word for it, and we do not expect
              you to take ours. Every kitchen on Taeam goes through our own
              halal audit before it opens on the app. Here is exactly what that
              audit looks like, what we publish, and where we draw hard lines.
            </p>
          </div>
        </div>
      </section>

      {/* ── Light: the audit, step by step ── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <Eyebrow>The audit</Eyebrow>
          <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
            Step by step.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <Reveal className="lg:order-2">
            <div className="relative h-64 overflow-hidden rounded-3xl border border-cream-line sm:h-80 lg:sticky lg:top-24 lg:h-[560px]">
              <Image
                src="/verify-audit.jpg"
                alt="Supplier paperwork being reviewed on a clipboard at a stainless steel counter in a restaurant kitchen"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-[38%_center]"
              />
            </div>
          </Reveal>
          <div className="space-y-10 lg:order-1">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={(i % 2) * 90}>
                <div className="grid gap-4 border-t border-cream-line pt-8 sm:grid-cols-[auto_1fr] sm:gap-8">
                  <span className="text-4xl font-black tracking-tight text-gold-deep sm:w-16 sm:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-2xl leading-relaxed text-ink-mute">
                      {step.copy}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Light, deep: neutrality ── */}
      <section className="bg-cream-deep py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Reveal>
            <Eyebrow>The method, disclosed</Eyebrow>
            <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
              Your standard, not ours.
            </h2>
            <div className="mt-4 max-w-xl space-y-4 leading-relaxed text-ink-mute">
              <p>
                Scholars hold different opinions on stunning and on machine
                slaughter, and communities do too. We do not support one view
                and we do not discourage another. That ruling is not ours to
                make.
              </p>
              <p>
                Our job is the facts. We verify whether the meat is hand or
                machine slaughtered, stunned or not stunned, and we state it
                per protein on the restaurant&apos;s page. You read the method
                and decide by your own standard.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-3xl bg-noir p-6 text-white sm:p-7">
              <div className="mb-4 flex items-center gap-2">
                <Khatam className="h-4 w-4 text-gold-bright" />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
                  Taeam Verified
                </span>
              </div>
              <div className="space-y-2">
                {[
                  ["Chicken", "Hand · non-stunned"],
                  ["Beef", "Machine · stunned"],
                  ["Lamb", "Hand · non-stunned"],
                ].map(([meat, method]) => (
                  <div
                    key={meat}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.07] px-4 py-3"
                  >
                    <span className="text-sm font-bold text-white">{meat}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gold-bright">
                      {method}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/40">
                The breakdown as it appears on a menu page. The method is
                stated, the choice stays yours.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Dark brand island: supplier privacy ── */}
      <section className="grain relative overflow-hidden bg-noir py-20 text-white sm:py-28">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <Eyebrow tone="bright">Supplier privacy</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
              What we can&apos;t always show you.
            </h2>
            <div className="mt-4 max-w-xl space-y-4 leading-relaxed text-white/70">
              <p>
                Regulations stop us from publicly disclosing supplier
                information. On top of that, whether a supplier&apos;s name
                appears on a menu page is the restaurant&apos;s call. Some
                share it, and some prefer to show the halal logo only.
              </p>
              <p className="font-semibold text-white">
                What never changes: every supplier goes through the same audit,
                named or not. The verification behind the mark is identical
                either way.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Supplier shared",
                copy: "Some kitchens choose to show who supplies their meat, right on their page.",
              },
              {
                title: "Halal logo only",
                copy: "Some prefer to keep the supplier private and show the verified mark alone.",
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 90}>
                <div className="h-full rounded-3xl border border-noir-line bg-noir-soft p-8">
                  <div className="flex items-center gap-2">
                    <Khatam className="h-5 w-5 text-gold-bright" />
                    <h3 className="font-semibold text-gold-bright">
                      {card.title}
                    </h3>
                  </div>
                  <p className="mt-3 leading-relaxed text-white/70">
                    {card.copy}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-wide text-white/40">
                    Same audit behind both
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Light: the hard lines ── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <Eyebrow>Non-negotiable</Eyebrow>
          <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
            Our hard lines.
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-mute">
            We are not onboarding any restaurant that is partially halal. These
            three rules have no exceptions and no workarounds.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HARD_LINES.map((line, i) => (
            <Reveal key={line.title} delay={(i % 3) * 90}>
              <div className="h-full rounded-3xl border border-cream-line bg-cream p-6 shadow-card">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-red">
                  Refused
                </span>
                <h3 className="mt-2.5 text-lg font-black uppercase tracking-tight text-ink">
                  {line.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">
                  {line.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Light: closing CTA ── */}
      <section className="mx-auto max-w-6xl px-4 pb-20 text-center sm:px-6 sm:pb-28">
        <Reveal>
          <div className="rounded-3xl bg-cream-deep px-6 py-14 sm:py-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
              See it before you order.
            </h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-mute">
              The gold mark and the per-protein breakdown sit on every
              restaurant&apos;s menu page.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              {SEALED ? (
                <JoinWaitlistButton className="rounded-full bg-gold-bright px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-noir transition-transform hover:-translate-y-0.5">
                  Join the waitlist
                </JoinWaitlistButton>
              ) : (
                <TransitionLink
                  href={orderHref()}
                  className="rounded-full bg-gold-bright px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-noir transition-transform hover:-translate-y-0.5"
                >
                  Browse the kitchens
                </TransitionLink>
              )}
              <Link
                href="/halal"
                className="group inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-gold-deep"
              >
                Read the trust gap research
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <Link
                href="/halal/hand-vs-machine"
                className="group inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-gold-deep"
              >
                Hand or machine, explained
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
