// Pre-launch seal.
//
// While SEALED, taeam.ca is a marketing + waitlist surface: the ordering funnel
// is hidden from every entry point, and direct-URL visits to the ordering /
// account routes bounce home (see components/LaunchGate). The home hero carries
// the waitlist form instead of the address search.
//
// Flip SEALED to false — or build with NEXT_PUBLIC_LAUNCH_MODE=open — at launch
// and the full ordering site returns with no other code changes.
export const SEALED = process.env.NEXT_PUBLIC_LAUNCH_MODE !== "open";

// Where every "order / browse" call-to-action points while sealed. The home
// hero's waitlist form has id="waitlist", so this drops the visitor onto it.
export const WAITLIST_HREF = "/#waitlist";

// Route prefixes that only make sense once ordering is live. Used to bounce
// direct visits (LaunchGate) and to hide links across the site (SiteMenu).
export const SEALED_PREFIXES = [
  "/restaurants",
  "/restaurant",
  "/edmonton",
  "/checkout",
  "/track",
  "/account",
  "/signin",
  "/orders",
  "/merchant",
  "/promo",
  "/refer",
  "/reserve",
];

/** True when `pathname` is part of the sealed ordering / account surface. */
export function isSealedPath(pathname: string): boolean {
  if (!SEALED) return false;
  return SEALED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

/**
 * Resolve an "order / browse" CTA target: the waitlist while sealed, the real
 * ordering route once open. Pair it with a sealed-aware label at the call site.
 */
export function orderHref(postLaunch = "/restaurants"): string {
  return SEALED ? WAITLIST_HREF : postLaunch;
}
