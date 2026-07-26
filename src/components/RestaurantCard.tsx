import Image from "next/image";
import Link from "next/link";
import { Star, Timer, Moped } from "@phosphor-icons/react/dist/ssr";
import { openStatus } from "@/lib/hours";
import { etaLabel, money } from "@/lib/format";
import type { Restaurant } from "@/lib/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { cn } from "@/lib/cn";

/**
 * Founding-restaurant card: big editorial media block, trust quad underneath.
 * `flip` alternates media/text sides on desktop so the browse page doesn't
 * read as a template grid.
 */
export function RestaurantCard({
  restaurant,
  flip = false,
}: {
  restaurant: Restaurant;
  flip?: boolean;
}) {
  const status = openStatus(restaurant);
  const eta = etaLabel(restaurant.delivery_time_min, restaurant.delivery_time_max);
  const hasReviews = (restaurant.total_reviews ?? 0) > 0;

  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className="group block focus-visible:outline-2 focus-visible:outline-gold"
    >
      <article
        className={cn(
          "grid items-center gap-5 md:grid-cols-2 md:gap-10",
          flip && "md:[&>*:first-child]:order-2",
        )}
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-cream-deep shadow-sm transition-shadow duration-500 group-hover:shadow-card">
          {restaurant.image_url ? (
            <Image
              src={restaurant.image_url}
              alt={restaurant.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center break-words px-4 text-center font-black text-3xl text-ink-mute">
              {restaurant.name}
            </div>
          )}
          {!status.open && (
            <div className="absolute inset-0 flex items-end bg-ink/45 p-4">
              <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-ink">
                {status.label}
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words font-black uppercase tracking-tight text-2xl text-ink md:text-3xl">
              {restaurant.name}
            </h3>
            <VerifiedBadge status={restaurant.verification_status} />
          </div>

          {restaurant.description && (
            <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-ink-mute">
              {restaurant.description}
            </p>
          )}

          {restaurant.categories && restaurant.categories.length > 0 && (
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-ink-mute">
              {restaurant.categories.slice(0, 4).join(" · ")}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <Star weight="fill" className="h-4 w-4 text-gold" aria-hidden />
              {hasReviews ? (
                <>
                  <strong className="font-semibold">
                    {(restaurant.average_rating ?? 0).toFixed(1)}
                  </strong>
                  <span className="text-ink-mute">({restaurant.total_reviews})</span>
                </>
              ) : (
                <span className="font-semibold text-gold-deep">New</span>
              )}
            </span>
            {eta && status.open && (
              <span className="inline-flex items-center gap-1.5">
                <Timer className="h-4 w-4 text-ink-mute" aria-hidden />
                {eta}
              </span>
            )}
            {restaurant.delivery_fee != null && (
              <span className="inline-flex items-center gap-1.5">
                <Moped className="h-4 w-4 text-ink-mute" aria-hidden />
                {restaurant.delivery_fee === 0
                  ? "Free delivery"
                  : `${money(restaurant.delivery_fee)} delivery`}
              </span>
            )}
            <span
              className={cn(
                "text-xs font-semibold",
                status.open ? "text-green" : "text-ink-mute",
              )}
            >
              {status.label}
            </span>
          </div>

          <span className="mt-5 inline-flex items-center gap-1 border-b border-ink pb-0.5 text-sm font-semibold text-ink transition-colors group-hover:border-gold group-hover:text-gold-deep">
            View menu
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </article>
    </Link>
  );
}
