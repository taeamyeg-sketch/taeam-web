import type { MetadataRoute } from "next";
import { SEALED, SEALED_PREFIXES } from "@/lib/launch";

// Static export bakes robots.txt at build time (same as sitemap.ts).
export const dynamic = "force-static";

/**
 * The single place that decides what search engines may crawl.
 *
 * This replaces the old hand-written public/robots.txt (which said
 * `Disallow: /`, hiding the whole site) and the blanket `X-Robots-Tag: noindex`
 * in public/_headers. That header was the real blocker: an HTTP header beats a
 * page's <meta name="robots">, so pages that explicitly asked to be indexed
 * (terms, cookies, privacy-policy, accessibility) were blocked regardless.
 *
 * It follows SEALED, so launch day needs no edit here: flipping
 * NEXT_PUBLIC_LAUNCH_MODE=open opens the ordering surface to crawlers at the
 * same moment it opens to people.
 */

// Never useful in search, sealed or not: transactional, per-user, or internal.
const ALWAYS_PRIVATE = [
  "/account",
  "/orders",
  "/merchant",
  "/promo",
  "/refer",
  "/banner",
  "/driver",
  "/checkout",
  "/signin",
  "/track",
];

export default function robots(): MetadataRoute.Robots {
  // While sealed these routes bounce to the home waitlist (see LaunchGate), so
  // letting a crawler find them would only produce dead entries in the index.
  const disallow = [
    ...new Set([...ALWAYS_PRIVATE, ...(SEALED ? SEALED_PREFIXES : [])]),
  ].sort();

  return {
    rules: [{ userAgent: "*", allow: "/", disallow }],
    sitemap: "https://taeam.ca/sitemap.xml",
  };
}
