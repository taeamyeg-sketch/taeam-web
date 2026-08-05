import Image from "next/image";
import Link from "next/link";
import { Star, Timer, Moped, MapPin } from "@phosphor-icons/react/dist/ssr";
import { openStatus } from "@/lib/hours";
import { etaLabel, money } from "@/lib/format";
import { distanceLabel } from "@/lib/geo";
import { verificationLabel } from "@/components/VerifiedBadge";
import { Seal } from "@/components/Pattern";
import type { Restaurant } from "@/lib/types";
import { cn } from "@/lib/cn";

/**
 * Compact browse tile: the DoorDash-density card in the Taeam skin. Image with
 * a trust badge, bold uppercase name, and a tight rating/eta/fee/distance row.
 * Shared by the horizontal rails and the main grid so the whole surface reads
 * as one system. `distanceKm` is the road distance from the chosen address
 * (already road-factored); `pickup` swaps the delivery-fee line for distance.
 */
export function RestaurantTile({
  restaurant,
  distanceKm,
  pickup = false,
  className,
}: {
  restaurant: Restaurant;
  distanceKm?: number;
  pickup?: boolean;
  className?: string;
}) {
  const status = openStatus(restaurant);
  const eta = etaLabel(restaurant.delivery_time_min, restaurant.delivery_time_max);
  const hasReviews = (restaurant.total_reviews ?? 0) > 0;
  const verified = restaurant.verification_status === "taeam_verified";
  const trust = verificationLabel(restaurant.verification_status);

  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className={cn(
        "group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream-deep shadow-sm transition-shadow duration-300 group-hover:shadow-card">
        {restaurant.image_url ? (
          <Image
            src={restaurant.image_url}
            alt={restaurant.name}
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 85vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center font-black uppercase leading-tight tracking-tight text-ink-mute">
            {restaurant.name}
          </div>
        )}

        {/* Trust badge — the thing the big platforms can't show. Same treatment
            as <VerifiedBadge> (Seal icon, gap, weight); only the background
            opacity differs so it stays legible over the photo. */}
        {trust && (
          <span
            className={cn(
              "absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm",
              verified
                ? "bg-gold/90 text-ink"
                : "bg-cream/90 text-ink-mute",
            )}
          >
            <Seal className="h-3 w-3" strokeWidth={1.8} />
            {verified ? "Verified" : "Halal"}
          </span>
        )}

        {!status.open && (
          <div className="absolute inset-0 flex items-end bg-ink/45 p-2.5">
            <span className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-semibold text-ink">
              {status.label}
            </span>
          </div>
        )}
      </div>

      <div className="mt-2.5">
        <h3 className="truncate text-[15px] font-black uppercase tracking-tight text-ink">
          {restaurant.name}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[13px] text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <Star weight="fill" className="h-3.5 w-3.5 text-gold" aria-hidden />
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
            <span className="inline-flex items-center gap-1">
              <Timer className="h-3.5 w-3.5 text-ink-mute" aria-hidden />
              {eta}
            </span>
          )}

          {pickup && distanceKm != null ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-ink-mute" aria-hidden />
              {distanceLabel(distanceKm)}
            </span>
          ) : (
            restaurant.delivery_fee != null && (
              <span className="inline-flex items-center gap-1">
                <Moped className="h-3.5 w-3.5 text-ink-mute" aria-hidden />
                {restaurant.delivery_fee === 0
                  ? "Free"
                  : money(restaurant.delivery_fee)}
              </span>
            )
          )}
        </div>

        {restaurant.categories && restaurant.categories.length > 0 && (
          <p className="mt-1 truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-mute">
            {restaurant.categories
              .filter((c) => c.toLowerCase() !== "halal")
              .slice(0, 3)
              .join(" · ")}
          </p>
        )}
      </div>
    </Link>
  );
}
