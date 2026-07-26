"use client";

import { useMemo, useState } from "react";
import { useLocation } from "@/lib/location-store";
import {
  MAX_DELIVERY_KM,
  WORTH_DRIVE_MIN_KM,
  WORTH_DRIVE_MAX_KM,
  roadDistanceKm,
} from "@/lib/geo";
import {
  EMPTY_HALAL_FILTER,
  applyHalalFilter,
  hasHalalFilter,
  halalFilterCount,
} from "@/lib/halal-filter";
import { applyQuickFilters } from "@/lib/collections";
import { usePrayerTimes } from "@/lib/prayer";
import type { Restaurant } from "@/lib/types";
import { RestaurantTile } from "./RestaurantTile";
import { RestaurantRail, type RailItem } from "./RestaurantRail";
import { CategoryRail, deriveCategories, slugify } from "./CategoryRail";
import { useOrderMode } from "@/lib/mode-store";
import { PromoBanner } from "./PromoBanner";
import { KitchensMap, type MapKitchen } from "./KitchensMap";
import { FiltersSheet, type FiltersState } from "./FiltersSheet";
import { BrowseSidebar } from "./BrowseSidebar";
import { SearchRow } from "./SearchRow";

const RAIL_MIN = 3;
const EMPTY_FILTERS: FiltersState = { halal: EMPTY_HALAL_FILTER, quick: [] };

const byDistance = (a: RailItem, b: RailItem) =>
  (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity);

const byPopularity = (a: RailItem, b: RailItem) =>
  (b.restaurant.total_reviews ?? 0) - (a.restaurant.total_reviews ?? 0) ||
  (b.restaurant.average_rating ?? 0) - (a.restaurant.average_rating ?? 0);

/**
 * The post-address browse home. Wayfinding (hub menu, address, prayer) lives in
 * the header now, so the body is lean: a promo banner, a slim mode + filters
 * bar, one category rail, the kitchens/mosques map, distance-sorted rails, and
 * the grid. Reads the shared location store the header writes to.
 */
export function BrowseHome({ restaurants }: { restaurants: Restaurant[] }) {
  const [loc] = useLocation();
  // Mode lives in the header now (above the address), so it comes from the
  // shared store rather than local state.
  const [mode] = useOrderMode();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [ignoreRadius, setIgnoreRadius] = useState(false);

  const { isRamadan } = usePrayerTimes(loc?.lat ?? null, loc?.lng ?? null);

  const live = useMemo(() => restaurants.filter((r) => !r.is_test), [restaurants]);
  const categories = useMemo(() => deriveCategories(live), [live]);

  const anyFilter = hasHalalFilter(filters.halal) || filters.quick.length > 0;
  const filterCount = halalFilterCount(filters.halal) + filters.quick.length;
  const searching = query.trim().length > 0;
  const lensActive = category !== "all" || anyFilter || searching;
  const pickupView = mode === "pickup";

  const { grid, popular, verified, worthDrive, mapKitchens } = useMemo(() => {
    const pickup = mode === "pickup";

    let base = applyHalalFilter(live, filters.halal);
    base = applyQuickFilters(base, filters.quick);
    if (pickup) base = base.filter((r) => r.supports_pickup);

    const annotated: RailItem[] = base.map((r) =>
      loc && r.latitude != null && r.longitude != null
        ? { restaurant: r, distanceKm: roadDistanceKm(loc.lat, loc.lng, r.latitude, r.longitude) }
        : { restaurant: r },
    );

    const radius = pickup ? WORTH_DRIVE_MAX_KM : MAX_DELIVERY_KM;
    let near: RailItem[];
    if (loc && !ignoreRadius) {
      near = annotated
        .filter((w) => w.distanceKm != null && w.distanceKm <= radius)
        .sort(byDistance);
    } else {
      near = [...annotated].sort(loc ? byDistance : byPopularity);
    }

    let gridItems =
      category === "all"
        ? near
        : near.filter((w) =>
            (w.restaurant.categories ?? []).some((c) => slugify(c) === category),
          );
    const q = query.trim().toLowerCase();
    if (q) {
      gridItems = gridItems.filter(
        (w) =>
          w.restaurant.name.toLowerCase().includes(q) ||
          (w.restaurant.categories ?? []).some((c) =>
            c.toLowerCase().includes(q),
          ),
      );
    }

    const railsOn = category === "all" && !anyFilter && !pickup && !q;
    const popularItems =
      railsOn && near.length >= RAIL_MIN ? [...near].sort(byPopularity).slice(0, 12) : [];
    const verifiedItems = railsOn
      ? near.filter((w) => w.restaurant.verification_status === "taeam_verified")
      : [];
    const worthDriveItems =
      railsOn && loc
        ? annotated
            .filter(
              (w) =>
                w.restaurant.supports_pickup &&
                w.distanceKm != null &&
                w.distanceKm > WORTH_DRIVE_MIN_KM &&
                w.distanceKm <= WORTH_DRIVE_MAX_KM,
            )
            .sort(byDistance)
            .slice(0, 12)
        : [];

    // Derived from the grid (not `near`) so the pins always match the kitchens
    // listed beside them — category, search and filters included.
    const mapItems: MapKitchen[] = gridItems
      .filter((w) => w.restaurant.latitude != null && w.restaurant.longitude != null)
      .map((w) => ({
        id: w.restaurant.id,
        name: w.restaurant.name,
        lat: w.restaurant.latitude as number,
        lng: w.restaurant.longitude as number,
      }));

    return {
      grid: gridItems,
      popular: popularItems,
      verified: verifiedItems.length >= RAIL_MIN ? verifiedItems.slice(0, 12) : [],
      worthDrive: worthDriveItems.length >= 2 ? worthDriveItems : [],
      mapKitchens: mapItems,
    };
  }, [live, loc, mode, category, query, filters, anyFilter, ignoreRadius]);

  const gridTitle = searching
    ? "Search results"
    : category !== "all"
      ? categories.find((c) => c.slug === category)?.name ?? "Kitchens"
      : loc && !ignoreRadius
        ? mode === "pickup"
          ? "Pickup near you"
          : "Kitchens near you"
        : "All kitchens";

  const gridEmpty = grid.length === 0;
  const outOfArea =
    loc && !ignoreRadius && gridEmpty && live.length > 0 && !lensActive;

  return (
    // Laptop-first: at xl the sidebar carries cuisines + filters on the left
    // and the browse surface stretches beside it, so wide screens read as a
    // designed desktop layout instead of a centered phone column.
    <div className="xl:grid xl:grid-cols-[260px_minmax(0,1fr)] xl:gap-12">
      <BrowseSidebar
        categories={categories}
        active={category}
        onCategory={setCategory}
        filters={filters}
        onFilters={setFilters}
        filterCount={filterCount}
        onOpenAll={() => setSheetOpen(true)}
      />

      <div className="min-w-0">
      <SearchRow
        value={query}
        onChange={setQuery}
        onOpenFilters={() => setSheetOpen(true)}
        filterCount={filterCount}
      />

      <div className="mt-4">
        <PromoBanner ramadan={isRamadan} />
      </div>

      {/* Horizontal chip rail is the phone/tablet pattern; the sidebar owns
          categories at xl. */}
      <CategoryRail
        categories={categories}
        active={category}
        onChange={setCategory}
        className="xl:hidden"
      />

      {/* Delivery: collapsible map, then the discovery rails. Pickup replaces both
          with the map + side-grid split below — when you're driving there, where
          it is *is* the decision. */}
      {!pickupView && mapKitchens.length > 0 && (
        <KitchensMap kitchens={mapKitchens} centerLat={loc?.lat} centerLng={loc?.lng} />
      )}

      {!pickupView && popular.length > 0 && (
        <RestaurantRail eyebrow="Trending" title="Popular near you" items={popular} />
      )}
      {!pickupView && verified.length > 0 && (
        <RestaurantRail eyebrow="Taeam Verified" title="Verified halal kitchens" items={verified} />
      )}
      {!pickupView && worthDrive.length > 0 && (
        <RestaurantRail eyebrow="Pickup" title="Worth the drive" items={worthDrive} pickup />
      )}

      <section className="mt-10">
        <h1 className="px-1 text-xl font-black uppercase tracking-tight text-ink sm:text-2xl">
          {gridTitle}
          {!gridEmpty && (
            <span className="ml-2 align-middle text-sm font-semibold text-ink-mute">
              {grid.length}
            </span>
          )}
        </h1>

        {gridEmpty ? (
          <EmptyState
            outOfArea={!!outOfArea}
            anyFilter={anyFilter}
            onShowAll={() => setIgnoreRadius(true)}
            onClearFilters={() => {
              setFilters(EMPTY_FILTERS);
              setCategory("all");
            }}
          />
        ) : pickupView ? (
          /* Map left (sticky through the scroll), kitchens beside it. */
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_1fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <KitchensMap
                embedded
                kitchens={mapKitchens}
                centerLat={loc?.lat}
                centerLng={loc?.lng}
                className="h-72 sm:h-96 lg:h-[calc(100dvh-9rem)]"
              />
            </div>
            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 2xl:grid-cols-3">
              {grid.map(({ restaurant, distanceKm }) => (
                <RestaurantTile
                  key={restaurant.id}
                  restaurant={restaurant}
                  distanceKm={distanceKm}
                  pickup
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {grid.map(({ restaurant, distanceKm }) => (
              <RestaurantTile
                key={restaurant.id}
                restaurant={restaurant}
                distanceKm={distanceKm}
                pickup={false}
              />
            ))}
          </div>
        )}
      </section>

      <FiltersSheet
        open={sheetOpen}
        initial={filters}
        onApply={(f) => {
          setFilters(f);
          setSheetOpen(false);
        }}
        onClose={() => setSheetOpen(false)}
      />
      </div>
    </div>
  );
}

function EmptyState({
  outOfArea,
  anyFilter,
  onShowAll,
  onClearFilters,
}: {
  outOfArea: boolean;
  anyFilter: boolean;
  onShowAll: () => void;
  onClearFilters: () => void;
}) {
  const title = outOfArea
    ? "Not in your area yet"
    : anyFilter
      ? "Nothing matches those filters"
      : "No kitchens here yet";
  const body = outOfArea
    ? "We're launching in Edmonton first. You can still look around everything on Taeam."
    : anyFilter
      ? "Try loosening your filters. More kitchens are onboarding every month."
      : "Kitchens are being onboarded. Check back soon.";

  return (
    <div className="mt-6 rounded-3xl border border-cream-line bg-cream-deep px-6 py-16 text-center">
      <p className="text-lg font-black uppercase tracking-tight text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-mute">{body}</p>
      {outOfArea && (
        <button
          onClick={onShowAll}
          className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Show all kitchens
        </button>
      )}
      {anyFilter && !outOfArea && (
        <button
          onClick={onClearFilters}
          className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
