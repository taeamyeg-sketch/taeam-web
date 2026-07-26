"use client";

import {
  BowlFood,
  Coffee,
  Fish,
  ForkKnife,
  Hamburger,
  IceCream,
  Leaf,
  Pizza,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// "Halal" is the whole site, not a filter of its own.
const EXCLUDED = new Set(["halal"]);

// Only map a glyph when it genuinely reads as the cuisine. Everything else is a
// clean text-only chip — better than repeating the same fork-knife on half the
// rail (which read as broken/duplicated).
const ICONS: Record<string, Icon> = {
  burgers: Hamburger,
  pizza: Pizza,
  chicken: BowlFood,
  desserts: IceCream,
  cafes: Coffee,
  coffee: Coffee,
  breakfast: Coffee,
  seafood: Fish,
  salads: Leaf,
};

const iconFor = (slug: string): Icon | null => ICONS[slug] ?? null;

export interface Category {
  slug: string;
  name: string;
  count: number;
}

/** Derive the category list from what the kitchens actually declare. */
export function deriveCategories(
  restaurants: { categories: string[] | null }[],
): Category[] {
  const seen = new Map<string, Category>();
  for (const r of restaurants) {
    for (const c of r.categories ?? []) {
      const slug = slugify(c);
      if (EXCLUDED.has(slug)) continue;
      const hit = seen.get(slug);
      if (hit) hit.count += 1;
      else seen.set(slug, { slug, name: c, count: 1 });
    }
  }
  return [...seen.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
}

/**
 * The sticky app-style category rail. Sits just under the site header and
 * filters the whole browse surface instantly. Honest by construction: it only
 * lists categories some live kitchen declares.
 */
export function CategoryRail({
  categories,
  active,
  onChange,
  className,
}: {
  categories: Category[];
  active: string;
  onChange: (slug: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rail sticky top-20 z-30 -mx-4 overflow-x-auto border-y border-cream-line bg-cream/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6",
        className,
      )}
    >
      <div className="flex w-max gap-2">
        <Chip
          icon={ForkKnife}
          label="All"
          active={active === "all"}
          onClick={() => onChange("all")}
        />
        {categories.map((c) => (
          <Chip
            key={c.slug}
            icon={iconFor(c.slug)}
            label={c.name}
            active={active === c.slug}
            onClick={() => onChange(c.slug)}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({
  icon: IconCmp,
  label,
  active,
  onClick,
}: {
  icon: Icon | null;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200",
        active
          ? "border-gold bg-gold text-ink shadow-sm"
          : "border-cream-line bg-cream-deep text-ink-soft hover:border-gold/50 hover:text-ink",
      )}
    >
      {IconCmp && (
        <IconCmp
          className={cn("h-4 w-4", active ? "text-ink" : "text-ink-mute")}
          weight={active ? "fill" : "regular"}
          aria-hidden
        />
      )}
      {label}
    </button>
  );
}
