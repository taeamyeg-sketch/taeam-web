"use client";

import { useRef } from "react";
import Link from "next/link";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { RestaurantTile } from "./RestaurantTile";
import type { Restaurant } from "@/lib/types";

export interface RailItem {
  restaurant: Restaurant;
  distanceKm?: number;
}

/**
 * A titled horizontal carousel of restaurant tiles — the scannable "Popular
 * near you" / "Taeam Verified" rows. Scrolls by touch/trackpad everywhere and
 * with caret buttons on desktop. Scrollbar is hidden via the shared `.rail`
 * utility so it reads clean.
 */
export function RestaurantRail({
  title,
  eyebrow,
  items,
  pickup = false,
  seeAllHref,
}: {
  title: string;
  eyebrow?: string;
  items: RailItem[];
  pickup?: boolean;
  seeAllHref?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  function nudge(dir: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4 px-1">
        <div>
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-deep">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-ink sm:text-2xl">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="text-sm font-bold text-gold-deep hover:text-ink"
            >
              See all
            </Link>
          )}
          <div className="hidden gap-1.5 sm:flex">
            <RailButton onClick={() => nudge(-1)} label="Scroll left">
              <CaretLeft weight="bold" className="h-4 w-4" />
            </RailButton>
            <RailButton onClick={() => nudge(1)} label="Scroll right">
              <CaretRight weight="bold" className="h-4 w-4" />
            </RailButton>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="rail mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-1"
      >
        {items.map(({ restaurant, distanceKm }) => (
          <div
            key={restaurant.id}
            className="w-[74vw] shrink-0 snap-start sm:w-[300px]"
          >
            <RestaurantTile
              restaurant={restaurant}
              distanceKm={distanceKm}
              pickup={pickup}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function RailButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-line bg-cream text-ink-soft transition-colors hover:border-gold hover:text-ink"
    >
      {children}
    </button>
  );
}
