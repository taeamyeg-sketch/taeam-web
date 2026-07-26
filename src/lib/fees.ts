import { supabaseBrowser } from "./supabase-browser";

/**
 * Client-side fee ESTIMATE, mirroring backend stripe.js calc functions and
 * the live `config` table (public-readable). The server remains authoritative
 * — create-payment-intent returns the real breakdown before any charge.
 */

export interface FeeConfig {
  delivery: {
    base_fee: number;
    long_distance_fee: number;
    per_km_surcharge: number;
    threshold_km: number;
    medium_threshold_km: number;
    max_distance_km: number;
  };
  service: { short: number; medium: number; long: number };
  smallCart: {
    high_fee: number;
    low_fee: number;
    threshold_low: number;
    threshold_high: number;
  };
  taxRate: number;
  driverPay: {
    base_short: number;
    base_medium: number;
    base_long: number;
    per_km_surcharge: number;
  };
}

const DEFAULTS: FeeConfig = {
  delivery: {
    base_fee: 4.99,
    long_distance_fee: 5.99,
    per_km_surcharge: 0.65,
    threshold_km: 7,
    medium_threshold_km: 10,
    max_distance_km: 15,
  },
  service: { short: 1.8, medium: 2.5, long: 3.5 },
  smallCart: { high_fee: 3, low_fee: 1.5, threshold_low: 20, threshold_high: 35 },
  taxRate: 0.05,
  driverPay: { base_short: 4, base_medium: 5, base_long: 5, per_km_surcharge: 0.89 },
};

export async function loadFeeConfig(): Promise<FeeConfig> {
  try {
    const { data } = await supabaseBrowser()
      .from("config")
      .select("key,data")
      .in("key", ["delivery_fees", "service_fees", "small_cart_fees", "tax", "driver_pay"]);
    const byKey = new Map((data ?? []).map((r) => [r.key, r.data]));
    return {
      delivery: { ...DEFAULTS.delivery, ...(byKey.get("delivery_fees") ?? {}) },
      service: { ...DEFAULTS.service, ...(byKey.get("service_fees") ?? {}) },
      smallCart: { ...DEFAULTS.smallCart, ...(byKey.get("small_cart_fees") ?? {}) },
      taxRate: byKey.get("tax")?.rate ?? DEFAULTS.taxRate,
      driverPay: { ...DEFAULTS.driverPay, ...(byKey.get("driver_pay") ?? {}) },
    };
  } catch {
    return DEFAULTS;
  }
}

export function estimateFees(
  cfg: FeeConfig,
  opts: {
    subtotal: number;
    distanceKm: number;
    pickup: boolean;
    tip: number;
    promoDiscount?: number;
    pointsDiscount?: number;
  },
) {
  const { subtotal, distanceKm, pickup, tip } = opts;
  const promoDiscount = opts.promoDiscount ?? 0;
  const pointsDiscount = opts.pointsDiscount ?? 0;

  let deliveryFee = 0;
  let serviceFee = 0;
  if (!pickup && distanceKm > 0) {
    const d = cfg.delivery;
    deliveryFee =
      distanceKm <= d.threshold_km
        ? d.base_fee
        : distanceKm <= d.medium_threshold_km
          ? d.long_distance_fee
          : d.long_distance_fee +
            Math.round((distanceKm - d.medium_threshold_km) * d.per_km_surcharge * 100) / 100;
    serviceFee =
      distanceKm <= d.threshold_km
        ? cfg.service.short
        : distanceKm <= d.medium_threshold_km
          ? cfg.service.medium
          : cfg.service.long;
  }

  const sc = cfg.smallCart;
  const smallCartFee =
    subtotal < sc.threshold_low ? sc.high_fee : subtotal < sc.threshold_high ? sc.low_fee : 0;

  const discounted = Math.max(0, subtotal - promoDiscount - pointsDiscount);
  const tax = Math.round(discounted * cfg.taxRate * 100) / 100;
  const total =
    Math.round((discounted + deliveryFee + serviceFee + smallCartFee + tax + tip) * 100) / 100;

  return { deliveryFee, serviceFee, smallCartFee, tax, total };
}

/** Mirrors packages/taeam_core DriverBasePay.compute for the order row. */
export function driverBasePay(cfg: FeeConfig, distanceKm: number) {
  const d = cfg.delivery;
  const p = cfg.driverPay;
  if (distanceKm <= d.threshold_km) {
    return { basePay: p.base_short, distanceSurcharge: 0 };
  }
  if (distanceKm <= d.medium_threshold_km) {
    return { basePay: p.base_medium, distanceSurcharge: 0 };
  }
  const surcharge =
    Math.round((distanceKm - d.medium_threshold_km) * p.per_km_surcharge * 100) / 100;
  return { basePay: p.base_long, distanceSurcharge: surcharge };
}
