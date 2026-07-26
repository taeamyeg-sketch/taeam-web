import Link from "next/link";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { LaunchZonesMap } from "./LaunchZonesMap";

/**
 * The taeam.ca "TAEAM LAUNCH" section, carried into the product site. Dark
 * brand island that flows straight out of the hero's black diagonal: the
 * Edmonton launch story on the left, the real city on the right — a dark-mode
 * Leaflet map with the live delivery zones glowing gold over the actual
 * street grid (see LaunchZonesMap).
 */
export function LaunchZones() {
  return (
    <section id="launch" className="grain relative overflow-hidden bg-noir py-20 text-white sm:py-28">
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <Reveal>
          <Eyebrow tone="bright">Edmonton, Alberta</Eyebrow>
          <h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl">
            Taeam <span className="text-gold-bright">launch</span>
          </h2>
          <p className="mt-4 max-w-md text-lg font-semibold leading-snug text-white/85">
            Edmonton&apos;s first 100% halal delivery platform. No guessing. No
            compromise.
          </p>

          {/* Deliberately short. The halal-verification argument belongs to
              TrustGap further down, which has the citations and the per-protein
              card to back it; making the same claim here only spends it early
              in its weakest form. This section is about place. */}
          <div className="mt-8 max-w-md space-y-4 leading-relaxed text-white/70">
            <p>
              We&apos;re not trying to be everything for everyone. One thing,
              built well: a halal food delivery app that actually earns your
              trust.
            </p>
            <p>
              We&apos;re starting in{" "}
              <strong className="font-semibold text-gold-bright">
                North and South Edmonton
              </strong>
              , growing street by street and restaurant by restaurant.
            </p>
          </div>

          {/* One section, one action. "How we verify halal" lives in TrustGap
              as a primary button — a faint duplicate of it here just trains
              people to skip the real one. */}
          <div className="mt-9">
            <Link
              href="/drive"
              className="inline-block rounded-full bg-gold-bright px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-noir transition-transform hover:-translate-y-0.5"
            >
              Drive with Taeam
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="overflow-hidden rounded-3xl border border-noir-line bg-noir-soft">
            <LaunchZonesMap className="h-[420px] sm:h-[500px]" />
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-t border-noir-line px-5 py-3.5 text-[11px] font-semibold">
              <span className="inline-flex items-center gap-2 uppercase tracking-[0.14em] text-gold-bright">
                <span aria-hidden className="h-2.5 w-2.5 rounded-[3px] border border-gold-bright bg-gold-bright/15" />
                Launch zones
              </span>
              <span className="text-white/40">
                More of the city unlocks as kitchens onboard.
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
