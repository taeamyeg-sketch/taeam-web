"use client";

import { supabaseBrowser } from "./supabase-browser";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

/** Authenticated call to the Railway backend (same API the app uses). */
async function post<T>(path: string, body: unknown): Promise<T> {
  const { data } = await supabaseBrowser().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new ApiError(401, "NotSignedIn", "Sign in to continue.");

  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      res.status,
      json.error ?? "Unknown",
      json.message ?? `Request failed (${res.status})`,
    );
  }
  return json as T;
}

export interface PriceBreakdown {
  subtotal: number;
  promoDiscount: number;
  pointsDiscount: number;
  subtotalAfterDiscounts: number;
  deliveryFee: number;
  serviceFee: number;
  smallCartFee: number;
  tax: number;
  tipAmount: number;
  donationAmount: number;
  grandTotal: number;
  plusApplied: string | null;
  orderType: string;
}

export interface CreatePaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  priceBreakdown: PriceBreakdown;
}

export function createPaymentIntent(body: {
  restaurantId: string;
  cartItems: {
    itemId: string;
    quantity: number;
    selectedOptions?: { group: string; choice: string }[];
  }[];
  deliveryDistanceKm: number;
  tipAmount: number;
  promoCode?: string;
  pointsToRedeem?: number;
  orderId: string;
  orderType: "delivery" | "pickup";
}): Promise<CreatePaymentIntentResult> {
  return post("/api/stripe/create-payment-intent", body);
}

export function finalizeDelivery(
  orderId: string,
  preference: "hand_to_me" | "leave_at_door",
): Promise<{ delivery_pin?: string | null }> {
  return post(`/api/orders/${orderId}/finalize-delivery`, {
    delivery_preference: preference,
  });
}

/** Kick the compute-route edge function (verify_jwt=false; explicit headers). */
export async function requestRoute(orderId: string): Promise<void> {
  const { data } = await supabaseBrowser().auth.getSession();
  await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/compute-route`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${
          data.session?.access_token ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }`,
      },
      body: JSON.stringify({ orderId }),
    },
  ).catch(() => {
    /* route is enhancement-only; tracking works without it */
  });
}
