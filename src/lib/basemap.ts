// CARTO basemap tiles for every Leaflet map on the site.
//
// Since October 2026 CARTO serves an "API KEY REQUIRED" image for any tile
// requested without a key. Browsers that had the tiles cached kept showing
// the real map, so it looked fine on a desktop that had visited before and
// broken in a fresh browser (Instagram's in-app browser, a new phone).
//
// The key is public by design: it ships in the page like every map key. The
// free commercial tier covers 1M requests a month. Override with
// NEXT_PUBLIC_CARTO_KEY to rotate it without a code change.
const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_KEY || "cb1_4bcg_1_066bcd173a7609291b1d046e";

export function cartoTiles(style: "dark_all" | "light_all"): string {
  return `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png?key=${CARTO_KEY}`;
}
