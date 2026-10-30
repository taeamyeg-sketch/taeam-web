"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/**
 * The launch list's 50% off closes at the 150th signup (Supabase migration
 * 20261028_02). After that people still join, for the 3,000 points only.
 * Must match public.waitlist_promo_cap().
 */
export const WAITLIST_PROMO_CAP = 150;

let cached: Promise<number | null> | null = null;

/** Spots left on the 50% off, from the database. Null when it can't be read. */
function fetchSpotsLeft(): Promise<number | null> {
  if (!cached) {
    cached = Promise.resolve(supabase.rpc("waitlist_promo_spots_left"))
      .then(({ data, error }) => (error || typeof data !== "number" ? null : data))
      .catch(() => null);
  }
  return cached;
}

/**
 * Live spots left on the 50% off, shared by the hero, the modal and the menu
 * (one request per page load). `spots` is null while loading or if the read
 * fails; callers then keep the 50% wording, and the confirmation email, which
 * the server writes from the row itself, is the final word.
 */
export function useWaitlistOffer() {
  const [spots, setSpots] = useState<number | null>(null);
  useEffect(() => {
    let live = true;
    fetchSpotsLeft().then((n) => {
      if (live) setSpots(n);
    });
    return () => {
      live = false;
    };
  }, []);
  return { spots, promoOpen: spots === null || spots > 0 };
}

/** "73 of 150 half-price spots left", or null when there is nothing to show. */
export function spotsLeftLine(spots: number | null): string | null {
  if (spots === null || spots <= 0) return null;
  return `${spots} of ${WAITLIST_PROMO_CAP} half-price spots left`;
}
