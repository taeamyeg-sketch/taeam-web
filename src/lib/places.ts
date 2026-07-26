/**
 * Address autocomplete client. Talks to the `places-suggest` edge function,
 * which proxies Google Places (browsers can't call Places directly, and the
 * key stays server-side). Mirrors the app's PlacesService shape.
 */

const FN = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/places-suggest`;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface PlaceDetails {
  formattedAddress: string;
  lat: number;
  lng: number;
}

async function call(body: unknown): Promise<Record<string, unknown>> {
  const res = await fetch(FN, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: ANON },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`places-suggest ${res.status}`);
  return res.json();
}

/** A fresh session token groups the keystrokes + one details call for billing. */
export function newSessionToken(): string {
  return crypto.randomUUID();
}

export async function suggestAddresses(
  input: string,
  sessionToken: string,
): Promise<PlacePrediction[]> {
  if (input.trim().length < 3) return [];
  try {
    const data = await call({ action: "autocomplete", input, sessionToken });
    if (data.status !== "OK") return [];
    const predictions = (data.predictions as Record<string, unknown>[]) ?? [];
    return predictions.map((p) => {
      const sf = (p.structured_formatting as Record<string, string>) ?? {};
      return {
        placeId: (p.place_id as string) ?? "",
        description: (p.description as string) ?? "",
        mainText: sf.main_text ?? (p.description as string) ?? "",
        secondaryText: sf.secondary_text ?? "",
      };
    });
  } catch {
    return [];
  }
}

export async function addressDetails(
  placeId: string,
  sessionToken: string,
): Promise<PlaceDetails | null> {
  try {
    const data = await call({ action: "details", placeId, sessionToken });
    if (data.status !== "OK") return null;
    const result = data.result as Record<string, unknown> | undefined;
    const geometry = result?.geometry as Record<string, unknown> | undefined;
    const loc = geometry?.location as { lat: number; lng: number } | undefined;
    if (!loc) return null;
    return {
      formattedAddress: (result?.formatted_address as string) ?? "",
      lat: loc.lat,
      lng: loc.lng,
    };
  } catch {
    return null;
  }
}
