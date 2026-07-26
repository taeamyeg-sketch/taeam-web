import { supabase } from "@/lib/supabase";
import type { DeliveryZone } from "@/lib/types";

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
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

/**
 * Check a coordinate against the live delivery zones. Returns the matched zone
 * (or null if out of area). Shared by the homepage hero and the address gate so
 * both give the same "we deliver to you" answer instead of a blind redirect.
 */
export async function checkDeliveryZone(
  lat: number,
  lng: number,
): Promise<DeliveryZone | null> {
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("id,name,center_lat,center_lng,radius_km,is_active")
    .eq("is_active", true);
  if (error) throw error;
  const zones = (data ?? []) as DeliveryZone[];
  return (
    zones.find(
      (z) => haversineKm(lat, lng, z.center_lat, z.center_lng) <= z.radius_km,
    ) ?? null
  );
}

/** Persist the chosen delivery location for checkout to pick up later. */
export function storeLocation(loc: {
  lat: number;
  lng: number;
  text: string;
  zone?: string;
}) {
  try {
    localStorage.setItem("taeam.location", JSON.stringify(loc));
  } catch {
    /* non-fatal (private mode / storage disabled) */
  }
}
