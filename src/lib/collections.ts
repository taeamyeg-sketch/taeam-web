import { openStatus } from "./hours";
import type { Restaurant } from "./types";

/**
 * Quick filters — the curated "lenses" (Top rated, Free delivery, …) now folded
 * into the Filters sheet instead of a second pill row. Each is a real predicate
 * over data we already load, and they combine (AND) with each other and halal.
 */
export interface QuickFilter {
  key: string;
  label: string;
  predicate: (r: Restaurant) => boolean;
}

export const QUICK_FILTERS: QuickFilter[] = [
  {
    key: "top_rated",
    label: "Top rated",
    predicate: (r) => (r.average_rating ?? 0) >= 4.5 && (r.total_reviews ?? 0) > 0,
  },
  {
    key: "free_delivery",
    label: "Free delivery",
    predicate: (r) => r.delivery_fee === 0,
  },
  {
    key: "open_now",
    label: "Open now",
    predicate: (r) => openStatus(r).open,
  },
  {
    key: "new",
    label: "New on Taeam",
    predicate: (r) => (r.total_reviews ?? 0) === 0,
  },
];

export function applyQuickFilters(
  list: Restaurant[],
  keys: string[],
): Restaurant[] {
  const preds = QUICK_FILTERS.filter((q) => keys.includes(q.key)).map(
    (q) => q.predicate,
  );
  return preds.length ? list.filter((r) => preds.every((p) => p(r))) : list;
}
