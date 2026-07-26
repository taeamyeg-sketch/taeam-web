"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { supabaseBrowser } from "./supabase-browser";

/**
 * The platform's Stripe mode lives in app_config (key 'stripe_mode',
 * column 'mode') — admin-flippable, public-readable. Same source the app
 * and backend read, so web charges always land in the same mode.
 */
export async function getStripeMode(): Promise<"live" | "test"> {
  try {
    const { data } = await supabaseBrowser()
      .from("app_config")
      .select("mode")
      .eq("key", "stripe_mode")
      .maybeSingle();
    return data?.mode === "live" ? "live" : "test";
  } catch {
    return "test";
  }
}

let stripePromise: Promise<Stripe | null> | null = null;
let loadedMode: "live" | "test" | null = null;

export async function getStripe(): Promise<{
  stripe: Stripe | null;
  mode: "live" | "test";
}> {
  const mode = await getStripeMode();
  if (!stripePromise || loadedMode !== mode) {
    loadedMode = mode;
    stripePromise = loadStripe(
      mode === "live"
        ? process.env.NEXT_PUBLIC_STRIPE_PK_LIVE!
        : process.env.NEXT_PUBLIC_STRIPE_PK_TEST!,
    );
  }
  return { stripe: await stripePromise, mode };
}
