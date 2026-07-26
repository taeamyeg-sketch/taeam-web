"use client";

import { CheckCircle, Faders, ForkKnife } from "@phosphor-icons/react";
import { QUICK_FILTERS } from "@/lib/collections";
import { EMPTY_HALAL_FILTER } from "@/lib/halal-filter";
import type { Category } from "./CategoryRail";
import type { FiltersState } from "./FiltersSheet";
import { cn } from "@/lib/cn";

/**
 * Desktop-only (xl+) browse sidebar. The site is a laptop-first surface, so on
 * a wide screen the left rail carries what phones keep behind chips and a
 * sheet: the cuisine list, quick filters, and the verified toggle — all
 * applying instantly. The slaughter/stunning detail stays in the full Filters
 * sheet ("All filters"). Below xl this renders nothing and the horizontal
 * CategoryRail + sheet take over, unchanged.
 */
export function BrowseSidebar({
  categories,
  active,
  onCategory,
  filters,
  onFilters,
  filterCount,
  onOpenAll,
}: {
  categories: Category[];
  active: string;
  onCategory: (slug: string) => void;
  filters: FiltersState;
  onFilters: (f: FiltersState) => void;
  filterCount: number;
  onOpenAll: () => void;
}) {
  const toggleQuick = (key: string) =>
    onFilters({
      ...filters,
      quick: filters.quick.includes(key)
        ? filters.quick.filter((k) => k !== key)
        : [...filters.quick, key],
    });

  const toggleVerified = () =>
    onFilters({
      ...filters,
      halal: { ...filters.halal, verifiedOnly: !filters.halal.verifiedOnly },
    });

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-8 pr-2">
        <p className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-ink-mute">
          Cuisines
        </p>
        <ul className="mt-3 space-y-0.5">
          <li>
            <CategoryItem
              label="All"
              icon
              count={null}
              active={active === "all"}
              onClick={() => onCategory("all")}
            />
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <CategoryItem
                label={c.name}
                count={c.count}
                active={active === c.slug}
                onClick={() => onCategory(c.slug)}
              />
            </li>
          ))}
        </ul>

        <p className="mt-9 px-1 text-[11px] font-black uppercase tracking-[0.2em] text-ink-mute">
          Quick filters
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_FILTERS.map((q) => {
            const on = filters.quick.includes(q.key);
            return (
              <button
                key={q.key}
                onClick={() => toggleQuick(q.key)}
                aria-pressed={on}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all",
                  on
                    ? "border-gold bg-gold text-ink shadow-sm"
                    : "border-cream-line bg-cream-deep text-ink-soft hover:border-gold/40",
                )}
              >
                {q.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={toggleVerified}
          aria-pressed={filters.halal.verifiedOnly}
          className={cn(
            "mt-4 flex w-full items-center gap-2.5 rounded-2xl border px-3.5 py-3 text-left transition-colors",
            filters.halal.verifiedOnly
              ? "border-green/40 bg-green/10"
              : "border-cream-line bg-cream-deep hover:border-gold/40",
          )}
        >
          <CheckCircle
            weight={filters.halal.verifiedOnly ? "fill" : "regular"}
            className={cn(
              "h-5 w-5 shrink-0",
              filters.halal.verifiedOnly ? "text-green" : "text-ink-mute",
            )}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-ink">
              Taeam Verified only
            </span>
            <span className="block text-[11px] leading-tight text-ink-mute">
              Sourcing reviewed by us
            </span>
          </span>
        </button>

        <button
          onClick={onOpenAll}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-cream-line py-2.5 text-[13px] font-semibold text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
        >
          <Faders className="h-4 w-4" aria-hidden />
          All filters
          {filterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink">
              {filterCount}
            </span>
          )}
        </button>

        {filterCount > 0 && (
          <button
            onClick={() =>
              onFilters({ halal: EMPTY_HALAL_FILTER, quick: [] })
            }
            className="mt-3 w-full text-center text-xs font-semibold uppercase tracking-wide text-ink-mute transition-colors hover:text-ink"
          >
            Clear filters
          </button>
        )}
      </div>
    </aside>
  );
}

function CategoryItem({
  label,
  count,
  active,
  onClick,
  icon = false,
}: {
  label: string;
  count: number | null;
  active: boolean;
  onClick: () => void;
  icon?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2 text-sm transition-colors",
        active
          ? "bg-gold font-bold text-ink shadow-sm"
          : "font-semibold text-ink-soft hover:bg-cream-deep hover:text-ink",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {icon && (
          <ForkKnife
            className={cn("h-4 w-4 shrink-0", active ? "text-ink" : "text-ink-mute")}
            weight={active ? "fill" : "regular"}
            aria-hidden
          />
        )}
        <span className="truncate">{label}</span>
      </span>
      {count != null && (
        <span
          className={cn(
            "shrink-0 text-xs",
            active ? "font-bold text-ink/60" : "text-ink-mute",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
