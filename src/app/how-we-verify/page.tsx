import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { TransitionLink } from "@/components/transition/PageTransition";
import { Seal } from "@/components/Pattern";
import { SEALED, orderHref } from "@/lib/launch";
import { JoinWaitlistButton } from "@/components/JoinWaitlistButton";

export const metadata: Metadata = {
  title: "How we verify halal",
  description:
    "Every restaurant on Taeam signs that its kitchen is halal only. Here is the paperwork we check behind that promise, and the label that tells you how far the check went.",
  openGraph: {
    title: "How we verify halal · Taeam",
    description:
      "The signed attestation, the supplier certificate, the invoice that matches it, and the label that tells you which of these a kitchen has.",
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

// Keep this in step with what the app actually shows: the three labels below
// are the halal_status_* strings in taeam_app (taeam_verified, certified,
// owner_declaration). Taeam reviews documents; it is not a certifier and does
// not inspect kitchens, so nothing on this page may say "audit" or "inspect"
// about Taeam's own check (launch test plan B6 #43, MANUAL_TASKS item 10).
const STEPS = [
  {
    title: "Halal only, in writing",
    copy: "Every restaurant signs a halal attestation with its partner agreement: every item it sells on Taeam is halal, and no non-halal meat or poultry is prepared, stored or handled in its kitchen. A restaurant that cannot sign it is not eligible.",
  },
  {
    title: "The supplier file",
    copy: "The restaurant names each meat supplier and gives us a copy of that supplier's halal certificate and a recent invoice from it.",
  },
  {
    title: "We read the paperwork",
    copy: "We check which body issued the certificate and when it expires, and we match it against the invoice, so the certificate belongs to the meat the kitchen actually buys.",
  },
  {
    title: "We record the method",
    copy: "Hand or machine. Stunned or not stunned. We write down what the certificate and the supplier state for each protein. Where they do not say, we write \"not stated\" rather than guess.",
  },
  {
    title: "A label that says how far we got",
    copy: "Every restaurant page in the app shows where its check stands. Until we finish reading the paperwork it says Under review; after that it carries one of three labels, with what it means. Taeam Verified: we read the certificate, matched the invoice and hold the signed attestation. Third-party certified: a halal certifier audits this supply chain and its certificate is on file with us. Owner's word: the restaurant declared it and we have not checked the paperwork yet.",
  },
];

const HARD_LINES = [
  {
    title: "Halal only",
    copy: "Every item a restaurant sells on Taeam has to be halal. We do not list halal sections, halal corners, or halal on request.",
  },
  {
    title: "No non-halal meat in the kitchen",
    copy: "The restaurant signs that no non-halal meat or poultry is prepared, stored or handled on its premises, and tells us if it shares equipment with another business that does.",
  },
  {
    title: "No paperwork, no gold mark",
    copy: "A kitchen that has not given us a current supplier certificate and a matching invoice does not get the Taeam Verified mark. Its page says Owner's word until it does.",
  },
];

export default function HowWeVerifyPage() {
  return (
    <>
      <Header overlay overlayTone="noir" />

      {/* ── Dark brand island: the claim ── */}
      <section className="relative overflow-hidden bg-noir pb-20 pt-32 text-white sm:pb-24 sm:pt-40">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div>
            <Eyebrow tone="bright">Taeam Verified</Eyebrow>
            <h1 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
              Signed, checked, <span className="text-gold">labelled.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              We do not take a label&apos;s word for it, and we do not expect
              you to take ours. Every restaurant on Taeam signs that its
              kitchen is halal only. Then we check the paperwork behind that
              promise, and every restaurant page tells you exactly how far the
              check went. We are not a halal certifier and we do not inspect
              kitchens. Here is what we do instead.
            </p>
          </div>
        </div>
      </section>

      {/* ── Light: the check, step by step ── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <Eyebrow>The check</Eyebrow>
          <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
            Step by step.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <Reveal className="lg:order-2">
            <div className="relative h-64 overflow-hidden rounded-2xl border border-cream-line sm:h-80 lg:sticky lg:top-24 lg:h-[560px]">
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
                Our job is the facts. We record whether the meat is hand or
                machine slaughtered, stunned or not stunned, as the supplier
                and its certifier state it, and we show it next to the
                restaurant. You read the method and decide by your own
                standard.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            {/* What a supplier check actually looks like: boxes on a prep
                table at the back door, before the paperwork gets read. */}
            <div className="relative mb-6 aspect-[3/2] overflow-hidden rounded-2xl border border-cream-line">
              <Image
                src="/verify-supplier.webp"
                alt="Plain cardboard boxes stacked on a stainless prep table at the back door of a restaurant kitchen"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="rounded-xl bg-noir p-6 text-white sm:p-7">
              <div className="mb-4 flex items-center gap-2">
                <Seal className="h-4 w-4 text-gold" />
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
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gold">
                      {method}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/40">
                An example breakdown. The method is stated, never ranked,
                and the choice stays yours.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Dark brand island: supplier privacy ── */}
      <section className="relative overflow-hidden bg-noir py-20 text-white sm:py-28">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <Eyebrow tone="bright">Supplier privacy</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
              What we can&apos;t always show you.
            </h2>
            <div className="mt-4 max-w-xl space-y-4 leading-relaxed text-white/70">
              <p>
                A restaurant&apos;s supplier, and what it pays them, is its
                business. Our agreement with every restaurant says we keep the
                supplier private, so we never publish it in the app or share
                it with another restaurant.
              </p>
              <p className="font-semibold text-white">
                What never changes: the paperwork behind the label is the same
                for every kitchen. You see the result of the check, not the
                invoices.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                title: "What you see",
                copy: "The halal label, the certifying body, the slaughter method, and the date we checked it.",
              },
              {
                title: "What stays private",
                copy: "The supplier's name, the invoices, and the prices. They stay between the restaurant and us.",
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 90}>
                <div className="h-full rounded-xl border border-noir-line bg-noir-soft p-8">
                  <div className="flex items-center gap-2">
                    <Seal className="h-5 w-5 text-gold" />
                    <h3 className="font-semibold text-gold">
                      {card.title}
                    </h3>
                  </div>
                  <p className="mt-3 leading-relaxed text-white/70">
                    {card.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── The hard lines. The band photo (a kitchen closed for the night) is
          near-black, so rather than dropping a dark rectangle into a cream
          section it carries the heading itself: the image IS the header
          treatment, and the refusal cards stay on cream below it. ── */}
      <section className="pb-20 sm:pb-28">
        <div className="relative isolate overflow-hidden bg-noir">
          <Image
            src="/verify-lines.webp"
            alt="A small commercial kitchen closed for the night, wiped down, lit by a single lamp above the pass"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-70"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-noir via-noir/75 to-noir/25" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <Reveal>
              <Eyebrow tone="bright">The rules</Eyebrow>
              <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl">
                Our hard lines.
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-white/70">
                We only onboard restaurants that are halal only. These three
                rules are part of the agreement every restaurant signs.
              </p>
            </Reveal>
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {HARD_LINES.map((line, i) => (
            <Reveal key={line.title} delay={(i % 3) * 90}>
              <div className="h-full rounded-xl border border-cream-line bg-cream p-6 shadow-card">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-red-deep">
                  The rule
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
          <div className="rounded-xl bg-cream-deep px-6 py-14 sm:py-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
              See it before you order.
            </h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-mute">
              The halal label, what it means, and the slaughter method sit on
              every restaurant&apos;s page in the app.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              {SEALED ? (
                <JoinWaitlistButton className="rounded-full bg-gold px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-noir">
                  Join the waitlist
                </JoinWaitlistButton>
              ) : (
                <TransitionLink
                  href={orderHref()}
                  className="rounded-full bg-gold px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-noir"
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
