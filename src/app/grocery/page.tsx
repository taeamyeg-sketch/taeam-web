import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/Eyebrow";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JoinWaitlistButton } from "@/components/JoinWaitlistButton";
import {
  DoorstepArt,
  GroceryShelfArt,
  PartnerShopArt,
  ScanArt,
} from "@/components/grocery/GroceryArt";
import { SEALED } from "@/lib/launch";
import { GROCERY_PHOTOS, PhotoSlot } from "./PhotoSlot";

/**
 * Taeam Grocery, the public explainer (GROCERY_PLAN sections 1, 3 and 6).
 * Taeam Grocery replaced the shelved Fridge (G-43); /fridge redirects here
 * (public/_redirects).
 *
 * Copy rules for this page, from the plan: no em or en dashes, no store or
 * chain names, no competitor names, no "cheaper than", no crossed-out or
 * "was" prices, and never a bare "Halal" or "Not halal" label. The price is
 * described only as one Taeam fee shown before you order: no numbers for it.
 * Internal economics (shopper pay, margins) never appear here.
 */
export const metadata: Metadata = {
  title: "Taeam Grocery",
  description:
    "Halal groceries, checked product by product, shopped by a real person and brought to your door. You pay the store's shelf price plus one Taeam fee shown before you order. Coming soon to South Edmonton.",
  openGraph: {
    title: "Taeam Grocery · Halal groceries, checked one by one",
    description:
      "Every product checked before it is listed, shopped by a real person you see by name, and never swapped for something similar. Coming soon to South Edmonton.",
    type: "website",
    url: "https://taeam.ca/grocery",
    siteName: "Taeam",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Taeam Grocery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taeam Grocery",
    description:
      "Halal groceries, checked product by product and shopped by a real person. Coming soon to South Edmonton.",
    images: ["/og.jpg"],
  },
};

const TIERS = [
  {
    title: "Certified",
    copy: "A halal certifier certifies the product, and we keep a copy of the certificate.",
    rows: [
      ["Certified by", "The certifier, named in full"],
      ["Valid until", "The date the certificate runs out"],
    ],
  },
  {
    title: "Assessed by Taeam Technologies Inc.",
    copy: "No certificate covers it, so we read every ingredient from a photo of the label and check each one against the Taeam standard. Anything the label cannot settle is confirmed with the maker first.",
    rows: [
      ["Checked by", "Taeam Technologies Inc."],
      ["Checked on", "The date we checked it"],
    ],
  },
];

const CHECK_POINTS = [
  {
    title: "We disclose, you decide",
    copy: "Some ingredients are accepted by some people and avoided by others. A product with one of them can still be listed, with that ingredient flagged so you can filter it out.",
  },
  {
    title: "Checked again, on a schedule",
    copy: "Certified products are checked again when the certificate runs out, or after 12 months if that comes first. Assessed products are checked every 6 months. A product that is overdue for its check comes off until it is checked again.",
  },
  {
    title: "Changes are caught",
    copy: "When a maker changes a label, the product goes back for a check straight away. A product that is recalled comes off.",
  },
  {
    title: "Every result says who checked it",
    copy: "If a product fails our standard, we name the ingredient that failed. If we have not checked it yet, we say so, and you can ask us to check it.",
  },
];

const STATUSES = [
  { dot: "bg-[#2F7D55]", label: "Available now", copy: "Order now. Checkout shows when it should arrive." },
  { dot: "bg-gold", label: "Shopping", copy: "On another order. Book a later window." },
  { dot: "bg-ink-mute", label: "Booked up today", copy: "Book another day." },
  { dot: "border border-ink-mute bg-transparent", label: "Off today", copy: "Book another day." },
];

const SWAPS = [
  {
    title: "You choose, item by item",
    copy: "For each item, pick one: swap it for an approved backup, or refund it.",
  },
  {
    title: "Backup costs less",
    copy: "You pay the lower price.",
  },
  {
    title: "Up to $1 more",
    copy: "You pay the original price. Taeam covers the difference.",
  },
  {
    title: "More than $1 more",
    copy: "We ask you first. No answer in 5 minutes and the item is refunded.",
  },
];

const PRICING = [
  {
    title: "A hold, not a charge",
    copy: "At checkout a temporary hold appears on your card, a little above your estimate. You pay only for what is bought, once your order is delivered.",
  },
  {
    title: "The fee follows the real total",
    copy: "The Taeam fee is worked out on what was actually bought. If an item is out of stock and refunded, your fee goes down with it.",
  },
  {
    title: "Groceries at cost",
    copy: "Taeam shops as your buying agent. The groceries part of your bill is exactly what the store charged for your order, with no markup. Tips are optional and go 100% to your shopper.",
  },
];

const FAQ = [
  {
    q: "Where do you deliver?",
    a: "South Edmonton first.",
  },
  {
    q: "Is there a minimum order?",
    a: "Yes, $35 of groceries.",
  },
  {
    q: "What if nobody answers the door?",
    a: "Your shopper calls you and waits 5 minutes. After that they leave your order at the door and take a photo of it, so you can see exactly where it is.",
  },
  {
    q: "What if an item is damaged, or I don't want it?",
    a: "Tell your shopper at the door. They take it off your bill before they confirm the delivery.",
  },
  {
    q: "Something is wrong after delivery?",
    a: "Report it in the app within 24 hours, with a photo. If we approve it, that item is refunded.",
  },
  {
    q: "What about allergens?",
    a: "We copy ingredients carefully, but the label on the product is what counts. Check it before eating.",
  },
  {
    q: "Which stores do you shop at?",
    a: "A store near you. Once your order is assigned, you see which one in your order details. Taeam is not affiliated with the stores it shops at.",
  },
];

export default function GroceryPage() {
  return (
    <>
      <Header overlay overlayTone="noir" />

      {/* ── Dark brand island: the idea ── */}
      <section className="bg-noir pb-16 pt-28 text-white sm:pb-24 sm:pt-36">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <Eyebrow tone="bright">Taeam Grocery · Coming soon</Eyebrow>
            <h1 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
              Halal groceries, <span className="text-gold">checked one by one.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              Every product is checked before it is listed. A real person,
              whose name you see, shops your order and brings it to your door.
              Coming soon to South Edmonton.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href="/halal-check"
                className="rounded-full bg-gold px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-noir"
              >
                Check a product
              </Link>
              <a
                href="#how-products-are-checked"
                className="inline-flex items-center gap-1 text-sm font-semibold text-white transition-colors hover:text-gold"
              >
                How it works <span aria-hidden>↓</span>
              </a>
            </div>
          </div>
          <div className="relative aspect-[360/230] overflow-hidden rounded-xl border border-noir-line bg-[#F6F1E7]">
            <GroceryShelfArt className="absolute inset-0 h-full w-full" />
          </div>
        </div>
      </section>

      {/* ── Light: how products are checked ── */}
      <section
        id="how-products-are-checked"
        aria-labelledby="checked-title"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
      >
        <Eyebrow>Every product</Eyebrow>
        <h2
          id="checked-title"
          className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl"
        >
          How products are checked.
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-mute">
          A product can be ordered only once we have checked it. It then
          carries one of two labels, and each one tells you exactly what stands
          behind it.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {TIERS.map((tier) => (
            <div key={tier.title} className="rounded-xl border border-cream-line bg-white p-6 sm:p-7">
              <h3 className="text-lg font-black uppercase tracking-tight text-ink">{tier.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-mute">{tier.copy}</p>
              <dl className="mt-5 divide-y divide-cream-line border-t border-cream-line text-sm">
                {tier.rows.map(([term, value]) => (
                  <div key={term} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5">
                    <dt className="font-semibold text-ink">{term}</dt>
                    <dd className="text-ink-soft">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {CHECK_POINTS.map((point) => (
            <div key={point.title} className="border-t border-cream-line pt-6">
              <h3 className="text-base font-black uppercase tracking-tight text-ink">{point.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-mute">{point.copy}</p>
            </div>
          ))}
        </div>

        {/* Notice: neutral box, colour only on the label. */}
        <div className="mt-12 rounded-xl border border-cream-line bg-cream-deep px-5 py-5 sm:px-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-deep">
            Check the label before eating
          </p>
          <p className="mt-2 leading-relaxed text-ink-soft">
            We copy ingredients carefully, but the label on the product is
            what counts, especially if you have an allergy. Makers can change
            a recipe after we check it.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href="/halal-check"
            className="inline-flex items-center gap-1 text-base font-bold text-gold-deep transition-colors hover:text-ink"
          >
            Check any product now <span aria-hidden>→</span>
          </Link>
          <span className="text-sm text-ink-mute">
            Search by name, brand or barcode. Free, with no sign-in.
          </span>
        </div>
      </section>

      {/* ── Light, deep: who shops ── */}
      <section aria-labelledby="shops-title" className="bg-cream-deep py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Eyebrow>Who shops</Eyebrow>
            <h2
              id="shops-title"
              className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl"
            >
              A real person, by name.
            </h2>
            <div className="mt-4 max-w-xl space-y-4 leading-relaxed text-ink-mute">
              <p>
                Before you order, you see your shopper&apos;s first name and
                what they are doing right now. That person is who shops your
                order. If someone else ever has to take over, you see the
                change.
              </p>
              <p>
                They scan every item against the exact product you chose, so
                anything else is refused right there in the aisle. Messages go
                through the app, and phone numbers stay private.
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-cream-line bg-cream">
              <p className="border-b border-cream-line px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-ink-mute">
                Your shopper&apos;s status
              </p>
              <ul className="divide-y divide-cream-line">
                {STATUSES.map((s) => (
                  <li key={s.label} className="flex items-start gap-3 px-5 py-3">
                    <span aria-hidden className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${s.dot}`} />
                    <span className="text-sm leading-relaxed">
                      <span className="font-semibold text-ink">{s.label}.</span>{" "}
                      <span className="text-ink-mute">{s.copy}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-cream-line bg-white p-5">
                <h3 className="text-base font-black uppercase tracking-tight text-ink">Order now</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">
                  When your shopper is free, order straight away and see an
                  estimated delivery time.
                </p>
              </div>
              <div className="rounded-xl border border-cream-line bg-white p-5">
                <h3 className="text-base font-black uppercase tracking-tight text-ink">Book a window</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">
                  Pick a 2-hour window from the hours your shopper has posted.
                  Checkout shows the real number of spots left.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:pt-10">
            <PhotoSlot
              photo={GROCERY_PHOTOS.scan}
              aspect="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 45vw"
              fallback={<ScanArt className="absolute inset-0 h-full w-full" />}
              className="lg:sticky lg:top-24"
            />
          </div>
        </div>
      </section>

      {/* ── Dark brand island: the promise ── */}
      <section aria-labelledby="promise-title" className="bg-noir py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Eyebrow tone="bright">The promise</Eyebrow>
          <h2
            id="promise-title"
            className="mt-3 max-w-3xl text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl"
          >
            Never swapped for something &ldquo;similar&rdquo;.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">
            Your halal item is never swapped for a similar one. Only for a
            backup we have verified, or you get a refund.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SWAPS.map((s) => (
              <div key={s.title} className="rounded-xl border border-noir-line bg-noir-soft p-6">
                <h3 className="font-bold text-gold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-white/70">{s.copy}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/50">
            A swap is never made if it would take your total above the hold on
            your card.
          </p>
        </div>
      </section>

      {/* ── Light: pricing ── */}
      <section aria-labelledby="pricing-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Eyebrow>Pricing</Eyebrow>
        <h2
          id="pricing-title"
          className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl"
        >
          One fee, shown first.
        </h2>
        <p className="mt-5 max-w-3xl text-xl font-semibold leading-snug text-ink sm:text-2xl">
          You pay the store&apos;s shelf price, sales included, plus one Taeam
          fee shown before you order.
        </p>
        <div className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-3">
          {PRICING.map((p) => (
            <div key={p.title} className="border-t border-cream-line pt-6">
              <h3 className="text-base font-black uppercase tracking-tight text-ink">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-mute">{p.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Light, deep: partners coming too ── */}
      <section aria-labelledby="partners-title" className="bg-cream-deep py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="lg:order-2">
            <Eyebrow>Coming too</Eyebrow>
            <h2
              id="partners-title"
              className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl"
            >
              Grocers and butchers, in the app.
            </h2>
            <div className="mt-4 max-w-xl space-y-4 leading-relaxed text-ink-mute">
              <p>
                Supermarkets, halal grocers and butchers are joining Taeam as
                partners. Each one gets its own shop in the app, and you order
                from it the same way you order from a restaurant. It is ready
                when they say.
              </p>
              <p>
                Butchers sell fixed-price packs, like a 1 kg pack of chicken
                thighs, so you know the price before you order. Their halal
                details show the same way a restaurant&apos;s do.
              </p>
            </div>
          </div>
          <PhotoSlot
            photo={GROCERY_PHOTOS.grocer}
            aspect="aspect-[3/2]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            fallback={<PartnerShopArt className="absolute inset-0 h-full w-full" />}
            className="lg:order-1"
          />
        </div>
      </section>

      {/* ── Light: questions ── */}
      <section aria-labelledby="faq-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <h2
              id="faq-title"
              className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl"
            >
              Good to know.
            </h2>
            <PhotoSlot
              photo={GROCERY_PHOTOS.doorstep}
              aspect="aspect-[3/2]"
              sizes="(max-width: 1024px) 100vw, 40vw"
              fallback={<DoorstepArt className="absolute inset-0 h-full w-full" />}
              className="mt-8"
            />
          </div>
          <dl className="divide-y divide-cream-line border-y border-cream-line">
            {FAQ.map((item) => (
              <div key={item.q} className="py-5">
                <dt className="font-bold text-ink">{item.q}</dt>
                <dd className="mt-1.5 leading-relaxed text-ink-mute">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Light: closing CTA ── */}
      <section className="mx-auto max-w-6xl px-4 pb-20 text-center sm:px-6 sm:pb-28">
        <div className="rounded-xl bg-cream-deep px-6 py-14 sm:py-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
            Groceries you can check.
          </h2>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-mute">
            Taeam Grocery is coming to the Taeam app. Until then, look up any
            product, free.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/halal-check"
              className="rounded-full bg-gold px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-noir"
            >
              Check a product
            </Link>
            {/* Same app entry as the rest of the site: the waitlist while
                sealed (the app is not in the stores yet, so a store link
                would land on a "not found" page), the store link once open. */}
            {SEALED ? (
              <JoinWaitlistButton className="rounded-full bg-noir px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-gold">
                Join the waitlist
              </JoinWaitlistButton>
            ) : (
              <a
                href="https://apps.apple.com/app/taeam"
                className="inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-gold-deep"
              >
                Get the Taeam app <span aria-hidden>→</span>
              </a>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
