import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { LaunchZones } from "@/components/marketing/LaunchZones";
import { TrustGap } from "@/components/marketing/TrustGap";
import { ContactSection } from "@/components/marketing/ContactSection";
import { RestaurantCard } from "@/components/RestaurantCard";
import { TransitionLink } from "@/components/transition/PageTransition";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/Eyebrow";
import { getRestaurants } from "@/lib/data";
import { SEALED } from "@/lib/launch";

/* The ecosystem grid is a bento: the two product-UI tiles (Arbaab, Rewards)
   sit side by side at equal width up top, then the photo tiles (Drive, Fridge)
   split 7/5 below so the section still reads editorial, not template. Ordering
   itself lives in the "Browse the kitchens" section further down. */
const ECOSYSTEM = [
  {
    title: "Arbaab",
    copy: "Your food concierge. Ask by chat and it finds the craving, reorders, and runs the app.",
    href: "/arbaab",
    cta: "Meet Arbaab",
    span: "lg:col-span-6",
    badge: null as string | null,
    tile: (
      <>
        <span className="grain absolute inset-0" />
        <div className="absolute inset-0 flex flex-col justify-center gap-2 p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-bright">
              <Image
                src="/takinator_avatar.png"
                alt=""
                width={18}
                height={18}
                className="object-contain"
              />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
              Arbaab
            </span>
          </div>
          <span className="mt-1 max-w-[88%] self-start rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2 text-[11px] leading-snug text-white/90">
            Find me something spicy under $15
          </span>
          <span className="max-w-[88%] self-end rounded-2xl rounded-br-sm bg-gold-bright px-3 py-2 text-[11px] font-medium leading-snug text-noir">
            On it. Three halal spots near you.
          </span>
        </div>
      </>
    ),
  },
  {
    title: "Rewards + Plus",
    copy: "10 points on every dollar, free points every day, and 1,000 points is a dollar off. Plus doubles it all.",
    href: "/rewards",
    cta: "See how rewards work",
    span: "lg:col-span-6",
    badge: null,
    tile: (
      <>
        <span className="grain absolute inset-0" />
        <div className="absolute inset-0 flex flex-col justify-center gap-2 p-5">
          {[
            ["Shawarma night", "+170 pts"],
            ["Daily check-in", "+5 pts"],
          ].map(([order, pts]) => (
            <div
              key={order}
              className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.07] px-3.5 py-2.5"
            >
              <span className="text-xs font-semibold text-white/90">{order}</span>
              <span className="text-xs font-bold text-gold-bright">{pts}</span>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between gap-3 rounded-xl bg-gold-bright px-3.5 py-2.5">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-noir">
              Taeam Plus
            </span>
            <span className="text-xs font-bold text-noir">Flat $2.99 delivery</span>
          </div>
        </div>
      </>
    ),
  },
  {
    title: "Drive with Tawsil",
    copy: "Deliver on your own schedule. One order at a time, and tips are always 100% yours.",
    href: "/drive",
    cta: "Learn more",
    span: "lg:col-span-7",
    badge: null,
    tile: (
      <>
        <Image
          src="/driver-hero.jpg"
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 60vw"
          className="object-cover object-[70%_center] transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_50px_14px_rgba(0,0,0,0.45)]" />
      </>
    ),
  },
  {
    title: "The Fridge",
    copy: "Grab-and-go halal from home kitchens near you. Fresh, sealed, ready when you are.",
    href: "/fridge",
    cta: "Take a look",
    span: "lg:col-span-5",
    badge: "Soon",
    tile: (
      <>
        <Image
          src="/fridge-feature.jpg"
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 60vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_50px_14px_rgba(0,0,0,0.45)]" />
      </>
    ),
  },
];

export default async function HomePage() {
  const restaurants = await getRestaurants();
  const featured = restaurants.slice(0, 3);

  return (
    <>
      <Header overlay overlayTone="dark" />

      {/* ── Dark brand island: the diagonal hero, hard cut into cream ── */}
      <MarketingHero />

      {/* ── Dark, continuing the hero's black edge: the Edmonton launch story ── */}
      <LaunchZones />

      {/* ── Light: the Taeam hub — every surface of the ecosystem, one grid ── */}
      <section id="ecosystem" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <Eyebrow>The halal ecosystem</Eyebrow>
          <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
            One app. Every halal craving.
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-mute">
            Ask, earn, deliver, discover. Every part of Taeam runs on one
            promise: if it&apos;s on here, the halal is disclosed, not assumed.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
          {ECOSYSTEM.map((card, i) => (
            <Reveal key={card.title} delay={(i % 2) * 90} className={card.span}>
              <Link href={card.href} className="group block">
                <div className="relative h-64 overflow-hidden rounded-2xl border border-cream-line bg-noir sm:h-72">
                  {card.tile}
                  {card.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink">
                      {card.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-black uppercase tracking-tight text-ink">
                  {card.title}
                </h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-mute">
                  {card.copy}
                </p>
                <span className="mt-2.5 inline-flex items-center gap-1 text-sm font-bold text-gold-deep">
                  {card.cta}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Dark brand island: the halal-proof band, hard cut both sides ── */}
      <TrustGap />

      {/* ── Light: founding restaurants (hidden while the site is sealed) ── */}
      {!SEALED && (
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Edmonton</Eyebrow>
              <h2 className="mt-3 font-black uppercase tracking-tight text-3xl text-ink sm:text-4xl">
                Browse the kitchens
              </h2>
            </div>
            <TransitionLink
              href="/restaurants"
              className="group inline-flex items-center gap-1 border-b border-ink pb-0.5 text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-gold-deep"
            >
              Browse all
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </TransitionLink>
          </div>
        </Reveal>

        <div className="mt-12 space-y-14">
          {featured.map((r, i) => (
            <Reveal key={r.id}>
              <RestaurantCard restaurant={r} flip={i % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </section>
      )}

      {/* ── Light: get in touch, mirrors taeam.ca's Contact Us ── */}
      <ContactSection />

      <Footer />
    </>
  );
}
