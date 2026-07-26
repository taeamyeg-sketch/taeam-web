"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass, SlidersHorizontal, X } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

// Mirrors taeam_app EnhancedSearchBar._hints — English, trailing ellipsis.
const HINTS = [
  "Search for shawarma...",
  "Search for biryani...",
  "Search for kunafa...",
  "Search for burgers...",
  "Search for butter chicken...",
  "Search for desserts...",
  "Search for breakfast...",
];

/**
 * The browse search row: an animated-hint search field, a Filters button, and
 * the Arbaab button with its rotating sweep-ring — the same trio the app puts
 * under the address. The hint fades + slides up on a 3s cycle (CSS, matching
 * the app's AnimatedSwitcher) and hides once the user types.
 */
export function SearchRow({
  value,
  onChange,
  onOpenFilters,
  filterCount,
}: {
  value: string;
  onChange: (v: string) => void;
  onOpenFilters: () => void;
  filterCount: number;
}) {
  const [hint, setHint] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHint((h) => (h + 1) % HINTS.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2.5">
      {/* Search field */}
      <div className="relative flex-1">
        <MagnifyingGlass
          className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-deep"
          weight="bold"
          aria-hidden
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search kitchens"
          className="h-12 w-full rounded-2xl border border-cream-line bg-cream pl-11 pr-10 text-base font-medium text-ink shadow-sm outline-none transition-colors focus:border-gold"
        />

        {/* Animated hint — only while empty */}
        {value === "" && (
          <div className="pointer-events-none absolute inset-y-0 left-11 right-10 flex items-center overflow-hidden">
            <span
              key={hint}
              className="hint-cycle truncate text-[15px] font-medium text-ink-mute"
            >
              {HINTS[hint]}
            </span>
          </div>
        )}

        {value !== "" && (
          <button
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 text-ink-mute hover:text-ink"
          >
            <X className="h-4 w-4" weight="bold" />
          </button>
        )}
      </div>

      {/* Filters */}
      <button
        onClick={onOpenFilters}
        aria-label="Filters"
        className={cn(
          "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-colors",
          filterCount > 0
            ? "border-gold bg-gold/15 text-gold-deep"
            : "border-cream-line bg-cream-deep text-ink-soft hover:border-gold/50",
        )}
      >
        <SlidersHorizontal className="h-5 w-5" aria-hidden />
        {filterCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-ink">
            {filterCount}
          </span>
        )}
      </button>

      {/* Arbaab */}
      <Link
        href="/arbaab"
        aria-label="Ask Arbaab"
        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold shadow-sm transition-transform hover:scale-105"
      >
        {/* A single crisp segment running the button's ACTUAL rounded-square
            border. pathLength normalises the perimeter to 100 so the dash + gap
            sum to exactly one lap — the loop closes with no seam. */}
        <svg
          aria-hidden
          viewBox="0 0 48 48"
          fill="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <rect
            x="1.25"
            y="1.25"
            width="45.5"
            height="45.5"
            rx="14.75"
            pathLength={100}
            stroke="#121212"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="arbaab-trace"
          />
        </svg>
        <Image
          src="/takinator_avatar.png"
          alt=""
          width={30}
          height={30}
          className="h-7 w-7 object-contain"
        />
      </Link>
    </div>
  );
}
