export function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// ── Delivery geography (mirrors taeam_app GeofencingUtils) ──
// Straight-line distance understates real driving distance on Edmonton's road
// grid; the app multiplies by 1.3 everywhere, so the web must match or the two
// surfaces would disagree on which kitchens are "nearby".
const ROAD_FACTOR = 1.3;

/** Kitchens beyond this drive distance can't deliver to the address. */
export const MAX_DELIVERY_KM = 20;
/** "Worth the drive" pickup band: too far to deliver, close enough to fetch. */
export const WORTH_DRIVE_MIN_KM = 15;
export const WORTH_DRIVE_MAX_KM = 50;

/** Haversine adjusted by the Edmonton road-grid factor (never multiply again). */
export function roadDistanceKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  return haversineKm(aLat, aLng, bLat, bLng) * ROAD_FACTOR;
}

/** Human label for a road distance, e.g. "2.4 km" · "800 m". */
export function distanceLabel(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
