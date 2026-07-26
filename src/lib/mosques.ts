import { haversineKm } from "./geo";

export interface Mosque {
  name: string;
  lat: number;
  lng: number;
}

/**
 * Edmonton mosques, pulled once from OpenStreetMap (ODbL) and baked in so the
 * map has real coordinates without a flaky runtime lookup. Refresh periodically
 * from Overpass (amenity=place_of_worship, religion=muslim) as the city grows.
 */
export const EDMONTON_MOSQUES: Mosque[] = [
  { name: "Al Ameen Masjid", lat: 53.57696, lng: -113.42576 },
  { name: "Al Rashid Mosque", lat: 53.59124, lng: -113.51572 },
  { name: "Al-Falah Masjid", lat: 53.46736, lng: -113.40949 },
  { name: "Al-Salaam Islamic Centre", lat: 53.59365, lng: -113.3849 },
  { name: "Alfalah Center (Masjid)", lat: 53.45573, lng: -113.41468 },
  { name: "Alfalah Center Northside", lat: 53.62774, lng: -113.40759 },
  { name: "An-Najashi Musallah", lat: 53.54964, lng: -113.51894 },
  { name: "Annoor Islamic Centre", lat: 53.46101, lng: -113.53147 },
  { name: "Bait-ul-Hadi", lat: 53.5371, lng: -113.43648 },
  { name: "Dar Al Sunnah", lat: 53.6071, lng: -113.484 },
  { name: "Faizan-e-Madina Islamic Centre", lat: 53.57066, lng: -113.48995 },
  { name: "Islamic Shia Ithna-Asheri Centre", lat: 53.46213, lng: -113.40589 },
  { name: "Markaz Al Imam Malik", lat: 53.60787, lng: -113.52602 },
  { name: "Markaz-Ul-Islam", lat: 53.46826, lng: -113.45476 },
  { name: "Masjid Al Fatima", lat: 53.45357, lng: -113.47269 },
  { name: "Masjid Al Omari", lat: 53.60037, lng: -113.44129 },
  { name: "Masjid Al-Imam Al-Shafie", lat: 53.56994, lng: -113.48747 },
  { name: "Masjid Annoor", lat: 53.46215, lng: -113.50377 },
  { name: "Masjid At-Taqwa", lat: 53.5511, lng: -113.4942 },
  { name: "Masjid Bilal", lat: 53.51442, lng: -113.45554 },
  { name: "Masjid Daril Ilmi", lat: 53.57011, lng: -113.40719 },
  { name: "Masjid in The Park", lat: 53.54513, lng: -113.31207 },
  { name: "Masjid Quba", lat: 53.57066, lng: -113.49606 },
  { name: "Medina Mosque", lat: 53.58851, lng: -113.42184 },
  { name: "Muslim Community Mosque", lat: 53.52168, lng: -113.50731 },
  { name: "Rahma Mosque", lat: 53.4967, lng: -113.62232 },
  { name: "Sahaba Mosque", lat: 53.55052, lng: -113.47747 },
];

/** Mosques within `radiusKm` of a point, nearest first. */
export function mosquesNear(
  lat: number,
  lng: number,
  radiusKm = 12,
): Mosque[] {
  return EDMONTON_MOSQUES.map((m) => ({
    m,
    d: haversineKm(lat, lng, m.lat, m.lng),
  }))
    .filter((x) => x.d <= radiusKm)
    .sort((a, b) => a.d - b.d)
    .map((x) => x.m);
}
