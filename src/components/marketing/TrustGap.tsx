import Image from "next/image";
import Link from "next/link";
import { Seal } from "@/components/Pattern";
import { Reveal } from "@/components/Reveal";

/**
 * The halal-proof band: the one dark brand island in the middle of the page.
 * The problem in real citations (the strongest content on either site), then
 * Taeam's answer. Vivid gold on warm near-black so it reads as the brand, not
 * the cream ordering surface. Carries id="standard" for the nav/footer anchor.
 */
const STATS = [
  {
    big: "4 in 10",
    copy: "fast food spots couldn't say how their “halal” meat was actually slaughtered.",
    src: "CBC Marketplace, 2024",
  },
  {
    big: "12+",
    copy: "halal certifiers in Canada, and nobody regulates the certifiers themselves.",
    src: "CBC News, 2016",
  },
];

const ANSWER = [
  {
    title: "Taeam Verified",
    copy: "Our team reviews halal sourcing documents before a kitchen earns the gold mark. Not self-reported. Checked.",
  },
  {
    title: "Slaughter method, disclosed",
    copy: "Hand or machine, stunned or non-stunned, stated on every restaurant so you decide by your own standard.",
  },
  {
    title: "Nothing to double-check",
    copy: "No scanning menus for pork or hidden alcohol. If it's on Taeam, it's halal. That's the deal.",
  },
];

export function TrustGap() {
  return (
    <section
      id="standard"
      className="grain relative overflow-hidden bg-noir py-20 text-white sm:py-28"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gold-bright">
                The halal trust gap
              </p>
              <h2 className="mt-4 max-w-2xl font-black uppercase tracking-tight text-3xl leading-tight sm:text-5xl">
                Most apps just ask you to trust the label.
              </h2>
            </div>
            <Link
              href="/halal"
              className="group inline-flex items-center gap-1 border-b border-white/40 pb-0.5 text-sm font-semibold text-white/85 transition-colors hover:border-gold-bright hover:text-gold-bright"
            >
              Read the full research
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {STATS.map((s, i) => (
            <Reveal key={s.big} delay={i * 90}>
              <div className="h-full rounded-3xl border border-noir-line bg-noir-soft p-8">
                <p className="font-black tracking-tight text-5xl text-gold-bright sm:text-6xl">
                  {s.big}
                </p>
                <p className="mt-3 text-lg leading-relaxed text-white/85">{s.copy}</p>
                <p className="mt-4 text-xs uppercase tracking-wide text-white/40">
                  {s.src}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Taeam's answer */}
        <Reveal>
          <div className="mt-14 flex items-start gap-4 border-t border-noir-line pt-10">
            <Seal className="mt-1.5 h-6 w-6 shrink-0 text-gold-bright" />
            <p className="max-w-2xl font-black uppercase tracking-tight text-2xl leading-snug sm:text-3xl">
              Taeam shows the full breakdown, before you order. Here is what that
              means.
            </p>
          </div>
        </Reveal>

        {/* The answer, with the per-protein disclosure card living right beside
            it — the disclosure isn't a separate feature tile anymore, it's the
            proof of the claim. */}
        <div className="mt-10 grid gap-10 md:grid-cols-[1.15fr_1fr] md:items-center">
          <div className="space-y-8">
            {ANSWER.map((row, i) => (
              <Reveal key={row.title} delay={i * 90}>
                <div className="border-t border-gold-bright/40 pt-5">
                  <h3 className="font-semibold text-gold-bright">{row.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
                    {row.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140}>
            {/* The trade the audit actually inspects, above the card that
                states what the audit produces. Photo then proof. */}
            <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-3xl border border-noir-line sm:aspect-[4/3]">
              <Image
                src="/trust-butcher.webp"
                alt="A butcher wrapping a parcel in paper behind the counter of a small independent halal butcher shop"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-noir/60 via-transparent to-transparent" />
            </div>
            <div className="rounded-3xl border border-noir-line bg-noir-soft p-6 sm:p-7">
              <div className="mb-4 flex items-center gap-2">
                <Seal className="h-4 w-4 text-gold-bright" />
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
                What the breakdown looks like: stated per protein, on every
                kitchen, before you order.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-14 flex flex-wrap items-center gap-5 border-t border-noir-line pt-10">
            <Link
              href="/how-we-verify"
              className="rounded-full bg-gold-bright px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-noir transition-transform hover:-translate-y-0.5"
            >
              How we verify halal
            </Link>
            <span className="text-sm text-white/50">
              The audit behind the mark: supplier checks, the slaughter method
              pinned down, and the lines we refuse to cross.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
