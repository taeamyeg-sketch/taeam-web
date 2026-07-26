import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Moped,
  Star,
  Storefront,
  Timer,
} from "@phosphor-icons/react/dist/ssr";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Khatam } from "@/components/Pattern";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { VerifiedBadge, slaughterLabel } from "@/components/VerifiedBadge";
import { getMenu, getRestaurant } from "@/lib/data";
import { openStatus } from "@/lib/hours";
import { etaLabel, money } from "@/lib/format";
import { cn } from "@/lib/cn";

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const { getRestaurants } = await import("@/lib/data");
  const restaurants = await getRestaurants();
  return restaurants.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const restaurant = await getRestaurant(id);
  if (!restaurant) return { title: "Restaurant not found" };
  return {
    title: `${restaurant.name} · Halal delivery in Edmonton`,
    description:
      restaurant.description ??
      `Order from ${restaurant.name} on Taeam. Halal delivery in Edmonton.`,
  };
}

export default async function RestaurantPage({ params }: Params) {
  const { id } = await params;
  const [restaurant, items] = await Promise.all([getRestaurant(id), getMenu(id)]);
  if (!restaurant) notFound();

  const status = openStatus(restaurant);
  const eta = etaLabel(restaurant.delivery_time_min, restaurant.delivery_time_max);
  const hasReviews = (restaurant.total_reviews ?? 0) > 0;
  const halal = slaughterLabel(restaurant);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    servesCuisine: restaurant.categories ?? restaurant.category ?? undefined,
    address: restaurant.address ?? undefined,
    image: restaurant.image_url ?? undefined,
    ...(hasReviews && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: restaurant.average_rating,
        reviewCount: restaurant.total_reviews,
      },
    }),
  };

  return (
    <>
      <Header />
      <main className="pb-16 pt-20">
        {/* Media banner */}
        <div className="relative h-48 w-full overflow-hidden bg-cream-deep sm:h-60 md:h-80">
          {restaurant.hero_video_url ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={restaurant.hero_video_url}
              poster={restaurant.image_url ?? undefined}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
            />
          ) : restaurant.image_url ? (
            <Image
              src={restaurant.image_url}
              alt={restaurant.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/20"
          />
          <Link
            href="/restaurants"
            className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-cream/95 px-3.5 py-2 text-sm font-semibold text-ink shadow-card sm:left-6"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All restaurants
          </Link>
        </div>

        {/* Info card overlapping the banner */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative z-10 -mt-16 rounded-3xl bg-cream p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="break-words font-black uppercase tracking-tight text-2xl text-ink sm:text-4xl">
                {restaurant.name}
              </h1>
              <VerifiedBadge status={restaurant.verification_status} />
            </div>

            {restaurant.description && (
              <p className="mt-2 max-w-2xl leading-relaxed text-ink-mute">
                {restaurant.description}
              </p>
            )}

            {restaurant.categories && restaurant.categories.length > 0 && (
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-ink-mute">
                {restaurant.categories.join(" · ")}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <Star weight="fill" className="h-4 w-4 text-gold" aria-hidden />
                {hasReviews ? (
                  <>
                    <strong className="font-semibold">
                      {(restaurant.average_rating ?? 0).toFixed(1)}
                    </strong>
                    <span className="text-ink-mute">
                      ({restaurant.total_reviews}{" "}
                      {restaurant.total_reviews === 1 ? "review" : "reviews"})
                    </span>
                  </>
                ) : (
                  <span className="font-semibold text-gold-deep">
                    New on Taeam
                  </span>
                )}
              </span>
              {eta && (
                <span className="inline-flex items-center gap-1.5">
                  <Timer className="h-4 w-4 text-ink-mute" aria-hidden />
                  {eta}
                </span>
              )}
              {restaurant.delivery_fee != null && (
                <span className="inline-flex items-center gap-1.5">
                  <Moped className="h-4 w-4 text-ink-mute" aria-hidden />
                  {money(restaurant.delivery_fee)} delivery
                </span>
              )}
              {restaurant.supports_pickup && (
                <span className="inline-flex items-center gap-1.5">
                  <Storefront className="h-4 w-4 text-ink-mute" aria-hidden />
                  Pickup available
                </span>
              )}
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  status.open ? "bg-green/10 text-green" : "bg-cream-deep text-ink-mute",
                )}
              >
                {status.label}
              </span>
            </div>

            {(halal || restaurant.address) && (
              <div className="mt-5 flex flex-col gap-2 border-t border-cream-line pt-4 text-sm text-ink-mute sm:flex-row sm:items-center sm:gap-6">
                {halal && (
                  <span className="inline-flex items-center gap-2">
                    <Khatam className="h-4 w-4 text-gold-deep" strokeWidth={1.6} />
                    {halal}
                  </span>
                )}
                {restaurant.address && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" aria-hidden />
                    {restaurant.address}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Menu */}
          <div className="mt-10">
            <MenuBrowser restaurant={restaurant} items={items} />
          </div>
        </div>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
