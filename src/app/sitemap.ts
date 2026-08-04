import type { MetadataRoute } from "next";
import { getRestaurants } from "@/lib/data";
import { SEALED, SEALED_PREFIXES } from "@/lib/launch";

// Static export bakes the sitemap at build time.
export const dynamic = "force-static";

const BASE = "https://taeam.ca";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// "Halal" is the whole site, not a cuisine page (mirrors /edmonton/[cuisine]).
const EXCLUDED = new Set(["halal"]);

const STATIC_ROUTES = [
  "",
  "/restaurants",
  "/rewards",
  "/halal",
  "/halal/hand-vs-machine",
  "/how-we-verify",
  "/about",
  "/drive",
  "/fridge",
  "/arbaab",
  "/reserve",
  "/help",
  "/terms",
  "/privacy-policy",
  "/cookies",
  "/accessibility",
];

/** True while `path` is one of the ordering routes the seal hides. */
const isSealedRoute = (path: string) =>
  SEALED && SEALED_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const restaurants = await getRestaurants();

  const cuisines = new Set<string>();
  for (const r of restaurants) {
    for (const c of r.categories ?? []) {
      const slug = slugify(c);
      if (!EXCLUDED.has(slug)) cuisines.add(slug);
    }
  }

  // A sitemap that lists URLs robots.txt disallows is a contradiction, and
  // while sealed those routes bounce to the home waitlist anyway. So the
  // ordering surface drops out of the sitemap for exactly as long as it is
  // sealed, and returns on its own when NEXT_PUBLIC_LAUNCH_MODE=open.
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.filter(
    (path) => !isSealedRoute(path),
  ).map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/restaurants" ? 0.9 : 0.6,
  }));

  if (!SEALED) {
    entries.push(
      ...restaurants.map((r) => ({
        url: `${BASE}/restaurant/${r.id}`,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
      ...[...cuisines].map((slug) => ({
        url: `${BASE}/edmonton/${slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    );
  }

  return entries;
}
