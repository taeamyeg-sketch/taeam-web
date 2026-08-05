import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Barcode,
  CalendarCheck,
  InstagramLogo,
  Lightbulb,
  PlayCircle,
  Star,
  Ticket,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { Footer } from "@/components/Footer";
import { SEALED, orderHref } from "@/lib/launch";
import { JoinWaitlistButton } from "@/components/JoinWaitlistButton";
import { Header } from "@/components/Header";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { TransitionLink } from "@/components/transition/PageTransition";
import { PointsCalculator } from "@/components/rewards/PointsCalculator";

export const metadata: Metadata = {
  title: "Rewards & Taeam Plus",
  description:
    "10 points on every dollar you order, a daily stack of free points, and 1,000 points is a straight dollar off. Plus: $8.99/mo for free deliveries, $0.99 service fees and 2x points.",
  openGraph: {
    title: "Rewards & Taeam Plus · Taeam",
    description:
      "Every order earns. Every day stacks. 1,000 points = $1.00 off, no punch cards, no fine print.",
    type: "website",
    url: "https://taeam.ca/rewards",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Taeam Rewards" },
    ],
  },
};

/* Every number on this page mirrors the live backend
   (backend/routes/api/rewards.js, subscriptions.js, fee_constants.dart):
   10 pts/$1 (20 on Plus), 1,000 pts = $1, redeem 1,000–5,000 per order,
   daily stack = 5 + 10 + 5×7, Plus = $8.99/mo · 6 free local deliveries then
   $2.99 (≤10km) / $4.99 (10–15km) · $0.99 service fee. Change the system there
   first, then here. */

const HERO_STATS = [
  { big: "10 pts", copy: "on every dollar you order, and 20 with Taeam Plus." },
  { big: "50 pts", copy: "a day for free: check-in, trivia, reward videos." },
  { big: "$1.00", copy: "off your food for every 1,000 points. That's it." },
];

const DAILY_STACK = [
  {
    icon: <CalendarCheck className="h-5 w-5" weight="bold" />,
    title: "Daily check-in",
    pts: "+5",
    copy: "Open the app, tap once, five points. Every single day counts.",
  },
  {
    icon: <Lightbulb className="h-5 w-5" weight="bold" />,
    title: "Halal trivia",
    pts: "+10",
    copy: "One question a day. Get it right and ten points land on the spot.",
  },
  {
    icon: <PlayCircle className="h-5 w-5" weight="bold" />,
    title: "Reward videos",
    pts: "+7 × 5",
    copy: "Watch a short video and earn seven points, up to five a day for 35 total.",
  },
];

const MORE_WAYS = [
  {
    icon: <UsersThree className="h-5 w-5" weight="bold" />,
    title: "Refer a friend",
    pts: "+1,000 each",
    copy: "They place their first order of $25+, and you both get a thousand points.",
  },
  {
    icon: <InstagramLogo className="h-5 w-5" weight="bold" />,
    title: "Tag & earn",
    pts: "+1,000 once",
    copy: "Post your order, tag @taeam.ca, and a one-time thousand-point thank you is yours.",
  },
  {
    icon: <Barcode className="h-5 w-5" weight="bold" />,
    title: "Scan your bag",
    pts: "+10 / order",
    copy: "Snap your delivered Taeam bag in the app and pocket ten more points.",
  },
  {
    icon: <Star className="h-5 w-5" weight="bold" />,
    title: "Rate your order",
    pts: "up to +20",
    copy: "Stars, written reviews, photos. Every honest review pays points.",
  },
  {
    icon: <Ticket className="h-5 w-5" weight="bold" />,
    title: "The Lucky Draw",
    pts: "200 pts a ticket",
    copy: "A weekly draw every Sunday: 50% off an order, free deliveries, or a week of no service fees.",
    spend: true,
  },
];

const TIERS = [
  {
    name: "Silver",
    gate: "Day one",
    bonus: null as string | null,
    copy: "Everyone starts here. Full earning rate from your very first order.",
  },
  {
    name: "Gold",
    gate: "2,000 lifetime pts",
    bonus: "+500 pts when you cross",
    copy: "Roughly your first $200 of food. The bonus lands automatically.",
  },
  {
    name: "Platinum",
    gate: "5,000 lifetime pts",
    bonus: "+1,000 pts when you cross",
    copy: "The regulars' tier. A full extra dollar the moment you arrive.",
  },
];

const PLUS_COMPARE = [
  {
    label: "Delivery, citywide",
    standard: "$4.99 to $9+",
    plus: "6 free local a month, then $2.99 up to 10 km · flat $4.99 anywhere",
  },
  {
    label: "Service fee",
    standard: "$1.80 to $3.50",
    plus: "$0.99, every order",
  },
  {
    label: "Points",
    standard: "10 pts / $1",
    plus: "20 pts / $1, doubled automatically",
  },
];

export default function RewardsPage() {
  return (
    <>
      <Header overlay overlayTone="dark" />

      {/* ── Dark brand island: the promise. A real weeknight takeout spread
          sits behind it at low opacity so the numbers land on food, not on a
          flat black field. ── */}
      <section className="grain relative overflow-hidden bg-noir pb-20 pt-32 text-white sm:pb-24 sm:pt-40">
        <Image
          src="/rewards-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none object-cover object-right opacity-25"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-noir via-noir/85 to-noir/40"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rise" style={{ animationDelay: "60ms" }}>
            <Eyebrow tone="bright">Taeam Rewards</Eyebrow>
            <h1 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
              Every order earns.
              <br />
              <span className="text-gold-bright">Every day stacks.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              Points land automatically on everything you order, free points
              stack every day you show up, and 1,000 points is a straight
              dollar off your food. No punch cards, no fine print.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href="#calculator"
                className="rounded-full bg-gold-bright px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-noir transition-transform hover:-translate-y-0.5"
              >
                Run your numbers
              </a>
              {SEALED ? (
                <JoinWaitlistButton className="group inline-flex items-center gap-1 text-sm font-semibold text-white/75 transition-colors hover:text-gold-bright">
                  Join the waitlist
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </JoinWaitlistButton>
              ) : (
                <TransitionLink
                  href={orderHref()}
                  className="group inline-flex items-center gap-1 text-sm font-semibold text-white/75 transition-colors hover:text-gold-bright"
                >
                  Start an order
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </TransitionLink>
              )}
            </div>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {HERO_STATS.map((s, i) => (
              <div
                key={s.big}
                className="rise rounded-3xl border border-noir-line bg-noir-soft p-6"
                style={{ animationDelay: `${180 + i * 110}ms` }}
              >
                <p className="text-4xl font-black tracking-tight text-gold-bright sm:text-5xl">
                  {s.big}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {s.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Light: how earning works ── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <Eyebrow>Earning</Eyebrow>
          <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
            Order. Points land.
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-mute">
            Ten points for every dollar of food, counted on your subtotal and
            credited the moment your order is delivered. Taeam Plus members
            earn double: twenty points on the dollar, automatically.
          </p>
        </Reveal>

        <Reveal delay={90}>
          <div className="mt-10 rounded-3xl bg-cream-deep p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-deep">
              The daily stack: up to 50 pts before you order anything
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {DAILY_STACK.map((d) => (
                <div
                  key={d.title}
                  className="rounded-2xl bg-cream p-5 shadow-card"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-deep">
                      {d.icon}
                    </span>
                    <span className="text-sm font-black text-gold-deep">
                      {d.pts}
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-sm font-black uppercase tracking-tight text-ink">
                    {d.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">
                    {d.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Dark brand island: the calculator ── */}
      <section
        id="calculator"
        className="grain relative overflow-hidden bg-noir py-20 text-white sm:py-28"
      >
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <Eyebrow tone="bright">Points calculator</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
              Run your numbers.
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-white/70">
              Slide to how you actually order. The math is the exact math the
              app uses. Nothing rounded in our favour.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <PointsCalculator />
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 text-xs leading-relaxed text-white/40">
              Points are earned on your order subtotal once delivered, and come
              back off if an order is cancelled. Redeem in bites of 1,000
              (that&apos;s $1.00) up to 5,000 points on a single order.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Light: redeeming + tiers ── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal>
            <Eyebrow>Redeeming</Eyebrow>
            <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
              Spending them is the easy part.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-mute">
              At checkout, slide your points onto the bill. Every 1,000 points
              knocks a dollar off, up to five dollars per order. No coupon
              codes, no minimum order, no waiting for a promo week.
            </p>
            <div className="mt-8 space-y-2.5 rounded-3xl bg-cream-deep p-6">
              {[
                ["Chicken Shawarma Platter", "$16.99"],
                ["Points applied", "−$3.00"],
              ].map(([label, amount], i) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-xl bg-cream px-4 py-3 shadow-card"
                >
                  <span
                    className={`text-sm font-semibold ${i === 1 ? "text-gold-deep" : "text-ink"}`}
                  >
                    {label}
                  </span>
                  <span
                    className={`text-sm font-black ${i === 1 ? "text-gold-deep" : "text-ink"}`}
                  >
                    {amount}
                  </span>
                </div>
              ))}
              <p className="pt-1.5 text-xs text-ink-mute">
                3,000 points, gone the way points should go: onto dinner.
              </p>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <Eyebrow>Tiers</Eyebrow>
              <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
                Loyalty, banked for life.
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-ink-mute">
                Tiers run on lifetime points, so redeeming never sets you back.
                Cross a line once and the bonus is yours.
              </p>
            </Reveal>
            <div className="mt-8 space-y-4">
              {TIERS.map((t, i) => (
                <Reveal key={t.name} delay={i * 90}>
                  <div className="flex items-start gap-5 rounded-3xl border border-cream-line bg-cream p-6 shadow-card">
                    <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-black uppercase text-gold-deep">
                      {t.name[0]}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-lg font-black uppercase tracking-tight text-ink">
                          {t.name}
                        </h3>
                        <span className="text-xs font-bold uppercase tracking-wide text-gold-deep">
                          {t.gate}
                        </span>
                        {t.bonus && (
                          <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] font-black text-gold-deep">
                            {t.bonus}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">
                        {t.copy}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Light, deep: more ways to earn ── */}
      <section className="bg-cream-deep py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-3xl">
              <Image
                src="/rewards-everyday.webp"
                alt="Two friends eating shawarma on an Edmonton sidewalk on an autumn evening"
                fill
                sizes="(max-width: 1024px) 100vw, 1152px"
                className="object-cover object-center"
              />
            </div>
          </Reveal>
          <Reveal>
            <Eyebrow>Beyond the order</Eyebrow>
            <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
              More ways to earn.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MORE_WAYS.map((w, i) => (
              <Reveal key={w.title} delay={(i % 3) * 90}>
                <div className="h-full rounded-3xl bg-cream p-6 shadow-card">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-deep">
                      {w.icon}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                        w.spend
                          ? "bg-noir text-gold-bright"
                          : "bg-gold/15 text-gold-deep"
                      }`}
                    >
                      {w.pts}
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-base font-black uppercase tracking-tight text-ink">
                    {w.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">
                    {w.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dark brand island: Taeam Plus. The handover at the door sits behind
          the price so "the fees, handled" has the moment it pays for. ── */}
      <section className="grain relative overflow-hidden bg-noir py-20 text-white sm:py-28">
        <Image
          src="/rewards-plus.webp"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover object-left opacity-25"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-l from-noir via-noir/85 to-noir/45"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <Reveal>
              <Eyebrow tone="bright">Taeam Plus</Eyebrow>
              <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
                The fees, handled.
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-white/70">
                One membership that pays for itself in a couple of orders: free
                local deliveries, a flat delivery fee anywhere else in the city,
                a 99-cent service fee, and every point doubled.
              </p>
              <p className="mt-6 text-5xl font-black tracking-tight text-gold-bright">
                $8.99
                <span className="ml-1 text-lg font-bold uppercase tracking-wide text-white/50">
                  / month
                </span>
              </p>
              <p className="mt-2 text-sm text-white/50">
                Cancel anytime. It&apos;s live in the app today, and your
                membership carries here at launch.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="overflow-hidden rounded-3xl border border-noir-line bg-noir-soft">
                {/* Column headers only exist where the columns do (sm+);
                    phones get per-cell labels inside each stacked row. */}
                <div className="hidden grid-cols-[1.1fr_1fr_1.4fr] gap-x-4 border-b border-noir-line px-6 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-white/50 sm:grid">
                  <span />
                  <span>Standard</span>
                  <span className="text-gold-bright">Taeam Plus</span>
                </div>
                {PLUS_COMPARE.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-noir-line px-6 py-5 last:border-b-0 sm:grid-cols-[1.1fr_1fr_1.4fr] sm:items-center sm:gap-y-0"
                  >
                    <span className="col-span-2 text-sm font-bold text-white sm:col-span-1">
                      {row.label}
                    </span>
                    <span className="text-sm text-white/55">
                      <span className="mb-0.5 block text-[10px] font-black uppercase tracking-[0.14em] text-white/40 sm:hidden">
                        Standard
                      </span>
                      {row.standard}
                    </span>
                    <span className="text-sm font-semibold text-gold-bright">
                      <span className="mb-0.5 block text-[10px] font-black uppercase tracking-[0.14em] text-white/40 sm:hidden">
                        Taeam Plus
                      </span>
                      {row.plus}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Light: closing CTA ── */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
            Start earning tonight.
          </h2>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-mute">
            Your first order is already worth points, and the daily stack is
            waiting in the app.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
            {SEALED ? (
              <JoinWaitlistButton className="group inline-flex items-center gap-2 rounded-full bg-gold-bright px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-noir transition-transform hover:-translate-y-0.5">
                Join the waitlist
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  weight="bold"
                />
              </JoinWaitlistButton>
            ) : (
              <TransitionLink
                href={orderHref()}
                className="group inline-flex items-center gap-2 rounded-full bg-gold-bright px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-noir transition-transform hover:-translate-y-0.5"
              >
                Browse the kitchens
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  weight="bold"
                />
              </TransitionLink>
            )}
            <a
              href="https://apps.apple.com/app/taeam"
              className="group inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-gold-deep"
            >
              Get the Taeam app
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
