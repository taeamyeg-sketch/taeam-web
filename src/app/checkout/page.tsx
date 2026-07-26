"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import {
  CircleNotch,
  HandPalm,
  House,
  NavigationArrow,
  Package,
  Storefront,
} from "@phosphor-icons/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { useAuth } from "@/components/auth/AuthContext";
import { useCart } from "@/components/cart/CartContext";
import {
  ApiError,
  createPaymentIntent,
  finalizeDelivery,
  type PriceBreakdown,
} from "@/lib/api";
import { estimateFees, loadFeeConfig, driverBasePay, type FeeConfig } from "@/lib/fees";
import { haversineKm } from "@/lib/geo";
import { money } from "@/lib/format";
import { getStripe } from "@/lib/stripe-mode";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { cn } from "@/lib/cn";

interface RestaurantRow {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  supports_pickup: boolean | null;
  is_open: boolean;
  accepting_orders: boolean;
  estimated_pickup_time: number | null;
}

interface AddressRow {
  id: string;
  label: string | null;
  full_address: string;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean | null;
}

type ChosenAddress = {
  text: string;
  lat: number;
  lng: number;
};

const TIP_PRESETS = [0, 2, 3, 5];

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();

  const [restaurant, setRestaurant] = useState<RestaurantRow | null>(null);
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [feeConfig, setFeeConfig] = useState<FeeConfig | null>(null);
  const [stripeMode, setStripeMode] = useState<"live" | "test">("test");
  const [stripeObj, setStripeObj] = useState<Stripe | null>(null);

  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [chosen, setChosen] = useState<ChosenAddress | null>(null);
  const [locating, setLocating] = useState(false);
  const [phone, setPhone] = useState("");
  const [preference, setPreference] = useState<"hand_to_me" | "leave_at_door">(
    "hand_to_me",
  );
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const [promo, setPromo] = useState("");
  const [usePoints, setUsePoints] = useState(false);
  const [note, setNote] = useState("");

  const [paying, setPaying] = useState<{
    orderId: string;
    clientSecret: string;
    paymentIntentId: string;
    breakdown: PriceBreakdown;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Once the card is charged, retries must never create a second charge.
  const committed = useRef<{ orderId: string; paymentIntentId: string } | null>(null);

  const restaurantId = cart.restaurant?.id;

  useEffect(() => {
    if (!restaurantId) return;
    supabaseBrowser()
      .from("restaurants")
      .select(
        "id,name,address,phone,latitude,longitude,supports_pickup,is_open,accepting_orders,estimated_pickup_time",
      )
      .eq("id", restaurantId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setError("We couldn't load the restaurant. Refresh to try again.");
          return;
        }
        setRestaurant(data as RestaurantRow | null);
      });
    loadFeeConfig().then(setFeeConfig);
    getStripe().then(({ stripe, mode }) => {
      setStripeObj(stripe);
      setStripeMode(mode);
    });
  }, [restaurantId]);

  useEffect(() => {
    if (!user) return;
    supabaseBrowser()
      .from("user_addresses")
      .select("id,label,full_address,latitude,longitude,is_default")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .then(({ data }) => {
        const rows = (data as AddressRow[]) ?? [];
        setAddresses(rows);
        const preferred = rows.find((a) => a.is_default && a.latitude && a.longitude);
        if (preferred) {
          setChosen({
            text: preferred.full_address,
            lat: preferred.latitude!,
            lng: preferred.longitude!,
          });
        }
      });
    if (profile?.phone) setPhone((p) => p || profile.phone!);
  }, [user, profile]);

  const distanceKm = useMemo(() => {
    if (orderType === "pickup") return 0;
    if (!chosen || !restaurant?.latitude || !restaurant?.longitude) return null;
    return (
      Math.round(
        haversineKm(chosen.lat, chosen.lng, restaurant.latitude, restaurant.longitude) * 100,
      ) / 100
    );
  }, [chosen, restaurant, orderType]);

  const pointsBalance = profile?.taeam_points ?? 0;
  const maxRedeemable = Math.min(
    Math.floor(pointsBalance / 1000) * 1000,
    5000,
    Math.floor(cart.subtotal) * 1000,
  );
  const pointsToRedeem = usePoints ? maxRedeemable : 0;

  const estimate = useMemo(() => {
    if (!feeConfig) return null;
    return estimateFees(feeConfig, {
      subtotal: cart.subtotal,
      distanceKm: distanceKm ?? 0,
      pickup: orderType === "pickup",
      tip,
      pointsDiscount: pointsToRedeem / 1000,
    });
  }, [feeConfig, cart.subtotal, distanceKm, orderType, tip, pointsToRedeem]);

  const outOfRange =
    distanceKm != null &&
    feeConfig != null &&
    distanceKm > feeConfig.delivery.max_distance_km;

  function locate() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setChosen({
          text: "My current location",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10000 },
    );
  }

  const startPayment = useCallback(async () => {
    if (!restaurantId) return;
    setBusy(true);
    setError(null);
    try {
      const orderId = committed.current?.orderId ?? crypto.randomUUID();
      const result = await createPaymentIntent({
        restaurantId,
        cartItems: cart.lines.map((l) => ({ itemId: l.itemId, quantity: l.qty })),
        deliveryDistanceKm: distanceKm ?? 0,
        tipAmount: tip,
        promoCode: promo.trim() ? promo.trim().toUpperCase() : undefined,
        pointsToRedeem: pointsToRedeem > 0 ? pointsToRedeem : undefined,
        orderId,
        orderType,
      });
      setPaying({ orderId, ...result, breakdown: result.priceBreakdown });
    } catch (e) {
      if (e instanceof ApiError && e.code === "OnboardingIncomplete") {
        setError(
          "One step left: open the Taeam app and set your account PIN (Profile → Security). It takes 30 seconds, then come back and pay here.",
        );
      } else {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    } finally {
      setBusy(false);
    }
  }, [restaurantId, cart.lines, distanceKm, tip, promo, pointsToRedeem, orderType]);

  // Post-payment: write the order row exactly the way the app does, then
  // finalize delivery preference (issues the PIN for hand_to_me).
  const placeOrder = useCallback(
    async (paymentIntentId: string, breakdown: PriceBreakdown, orderId: string) => {
      if (!restaurant || !user || !feeConfig) throw new Error("Missing state");
      committed.current = { orderId, paymentIntentId };

      const { data: restRow } = await supabaseBrowser()
        .from("restaurants")
        .select("address, phone, city_id")
        .eq("id", restaurant.id)
        .maybeSingle();
      if (!restRow?.city_id) throw new Error("Restaurant unavailable. Contact support.");

      const isPickup = orderType === "pickup";
      const pay = driverBasePay(feeConfig, distanceKm ?? 0);
      const orderData = {
        id: orderId,
        restaurant_id: restaurant.id,
        city_id: restRow.city_id,
        restaurant_name: restaurant.name,
        items: cart.lines.map((l) => ({
          id: l.itemId,
          name: l.name,
          price: l.price,
          quantity: l.qty,
          selectedOptions: [],
          specialInstructions: l.note ?? null,
          imageUrl: l.imageUrl ?? null,
          categoryId: l.category ?? null,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
        })),
        subtotal: breakdown.subtotal,
        tax: breakdown.tax,
        delivery_fee: breakdown.deliveryFee,
        total: breakdown.grandTotal,
        status: "pending",
        payment_method: "credit_card",
        delivery_address: isPickup
          ? (restRow.address ?? restaurant.name)
          : (chosen?.text ?? ""),
        contact_phone: phone,
        notes: note,
        user_id: user.id,
        customer_id: user.id,
        customer_email: user.email ?? profile?.email ?? "",
        customer_name: profile?.name ?? user.email?.split("@")[0] ?? "Customer",
        customer_phone: phone,
        restaurant_address: restRow.address ?? "",
        restaurant_phone: restRow.phone ?? "",
        payment_intent_id: paymentIntentId,
        tip_amount: breakdown.tipAmount,
        donation_amount: 0,
        service_fee: breakdown.serviceFee,
        small_cart_fee: breakdown.smallCartFee,
        restaurant_commission: 0, // overwritten server-side by trigger
        created_at: new Date().toISOString(),
        driver_id: "",
        scan_earn_completed: false,
        restaurant_lat: restaurant.latitude,
        restaurant_lng: restaurant.longitude,
        customer_lat: isPickup ? null : (chosen?.lat ?? null),
        customer_lng: isPickup ? null : (chosen?.lng ?? null),
        delivery_distance_km: distanceKm ?? 0,
        driver_base_pay: pay.basePay,
        driver_distance_surcharge: pay.distanceSurcharge,
        ...(breakdown.promoDiscount > 0 && promo.trim()
          ? { promo_code: promo.trim().toUpperCase() }
          : {}),
        discount_amount: breakdown.promoDiscount + breakdown.pointsDiscount,
        deal_discount_amount: 0,
        order_type: orderType,
        source: "web",
      };

      const { error: insertError } = await supabaseBrowser()
        .from("orders")
        .upsert(orderData);
      if (insertError) throw new Error(`Order save failed: ${insertError.message}`);

      if (!isPickup) {
        try {
          const { delivery_pin } = await finalizeDelivery(orderId, preference);
          if (delivery_pin) {
            localStorage.setItem(`taeam.pin.${orderId}`, delivery_pin);
          }
        } catch {
          /* preference can be finalized later; order is already placed */
        }
      }

      cart.clear();
      refreshProfile();
      router.push(`/track?id=${orderId}`);
    },
    [
      restaurant,
      user,
      profile,
      feeConfig,
      orderType,
      chosen,
      phone,
      note,
      promo,
      preference,
      distanceKm,
      cart,
      refreshProfile,
      router,
    ],
  );

  // ── Guards ──
  if (authLoading) {
    return (
      <Shell>
        <p className="py-24 text-center text-sm text-ink-mute">Loading…</p>
      </Shell>
    );
  }
  if (!user) {
    return (
      <Shell>
        <GateCard
          title="Sign in to check out"
          body="Your points, addresses and order history come with you, same account as the app."
          cta={{ href: "/signin?next=/checkout", label: "Sign in or join" }}
        />
      </Shell>
    );
  }
  if (cart.count === 0 && !busy && !paying) {
    return (
      <Shell>
        <GateCard
          title="Your cart is empty"
          body="Find something worth ordering. Everything on Taeam is halal."
          cta={{ href: "/restaurants", label: "Browse restaurants" }}
        />
      </Shell>
    );
  }

  // A closed kitchen must never take money, whatever the cart says.
  const restaurantClosed =
    !!restaurant && !(restaurant.is_open && restaurant.accepting_orders);

  const readyToPay =
    !!restaurant &&
    !restaurantClosed &&
    phone.trim().length >= 7 &&
    (orderType === "pickup" || (chosen != null && !outOfRange));

  return (
    <Shell>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-black uppercase tracking-tight text-3xl text-ink sm:text-4xl">
          Checkout
        </h1>
        <p className="mt-1.5 text-sm text-ink-mute">
          {cart.restaurant?.name} · {cart.count} {cart.count === 1 ? "item" : "items"}
          {stripeMode === "test" && (
            <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-deep">
              Test mode
            </span>
          )}
        </p>

        {restaurantClosed && (
          <div className="mt-6 rounded-2xl border border-cream-line bg-white/60 p-4 text-sm text-ink">
            <p className="font-semibold">
              {cart.restaurant?.name} is closed right now.
            </p>
            <p className="mt-1 text-ink-mute">
              Your cart is saved. Come back when the kitchen opens and your
              order will be ready to place.
            </p>
          </div>
        )}

        {!paying ? (
          <div className="mt-8 space-y-8">
            {/* Order type */}
            {restaurant?.supports_pickup && (
              <section>
                <SectionTitle>Delivery or pickup</SectionTitle>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(["delivery", "pickup"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setOrderType(t)}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-sm font-semibold capitalize",
                        orderType === t
                          ? "border-gold bg-gold/10 text-ink"
                          : "border-cream-line bg-white/50 text-ink-mute",
                      )}
                    >
                      {t === "delivery" ? (
                        <Package className="h-4.5 w-4.5" aria-hidden />
                      ) : (
                        <Storefront className="h-4.5 w-4.5" aria-hidden />
                      )}
                      {t}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Address */}
            {orderType === "delivery" && (
              <section>
                <SectionTitle>Deliver to</SectionTitle>
                <div className="mt-3">
                  <AddressAutocomplete
                    onPick={(a) => setChosen({ text: a.text, lat: a.lat, lng: a.lng })}
                    placeholder="Search a delivery address"
                    fieldClassName="rounded-2xl border border-cream-line bg-white/50 px-4 py-3.5 focus-within:border-gold"
                    inputClassName="text-base text-ink placeholder:text-ink-mute"
                  />
                </div>
                <div className="mt-2 space-y-2">
                  {addresses
                    .filter((a) => a.latitude != null && a.longitude != null)
                    .map((a) => (
                      <button
                        key={a.id}
                        onClick={() =>
                          setChosen({
                            text: a.full_address,
                            lat: a.latitude!,
                            lng: a.longitude!,
                          })
                        }
                        className={cn(
                          "flex w-full items-start gap-3 rounded-2xl border p-4 text-left",
                          chosen?.text === a.full_address
                            ? "border-gold bg-gold/10"
                            : "border-cream-line bg-white/50",
                        )}
                      >
                        <House className="mt-0.5 h-5 w-5 shrink-0 text-ink-mute" aria-hidden />
                        <span>
                          <span className="block text-sm font-semibold text-ink">
                            {a.label || "Address"}
                          </span>
                          <span className="block text-sm text-ink-mute">
                            {a.full_address}
                          </span>
                        </span>
                      </button>
                    ))}
                  <button
                    onClick={locate}
                    disabled={locating}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border p-4 text-left text-sm font-semibold",
                      chosen?.text === "My current location"
                        ? "border-gold bg-gold/10 text-ink"
                        : "border-cream-line bg-white/50 text-ink-soft",
                    )}
                  >
                    {locating ? (
                      <CircleNotch className="h-5 w-5 animate-spin text-ink-mute" aria-hidden />
                    ) : (
                      <NavigationArrow className="h-5 w-5 text-ink-mute" aria-hidden />
                    )}
                    {locating ? "Locating…" : "Use my current location"}
                  </button>
                </div>
                {distanceKm != null && !outOfRange && (
                  <p className="mt-2 text-xs text-ink-mute">
                    {distanceKm} km from {restaurant?.name}
                  </p>
                )}
                {outOfRange && (
                  <p className="mt-2 text-sm font-medium text-red">
                    That address is outside the {feeConfig?.delivery.max_distance_km} km
                    delivery range for this kitchen.
                  </p>
                )}
                {!chosen && (
                  <p className="mt-2 text-xs text-ink-mute">
                    Search your address above, choose a saved one, or use your
                    current location.
                  </p>
                )}
              </section>
            )}

            {/* Delivery preference */}
            {orderType === "delivery" && (
              <section>
                <SectionTitle>At the door</SectionTitle>
                <div className="mt-3 grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
                  <button
                    onClick={() => setPreference("hand_to_me")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-sm font-semibold",
                      preference === "hand_to_me"
                        ? "border-gold bg-gold/10 text-ink"
                        : "border-cream-line bg-white/50 text-ink-mute",
                    )}
                  >
                    <HandPalm className="h-4.5 w-4.5" aria-hidden />
                    Hand it to me
                  </button>
                  <button
                    onClick={() => setPreference("leave_at_door")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-sm font-semibold",
                      preference === "leave_at_door"
                        ? "border-gold bg-gold/10 text-ink"
                        : "border-cream-line bg-white/50 text-ink-mute",
                    )}
                  >
                    <Package className="h-4.5 w-4.5" aria-hidden />
                    Leave at door
                  </button>
                </div>
                {preference === "hand_to_me" && (
                  <p className="mt-2 text-xs text-ink-mute">
                    You&apos;ll get a 4-digit PIN, and the driver confirms it at handoff.
                  </p>
                )}
              </section>
            )}

            {/* Phone */}
            <section>
              <SectionTitle>Contact phone</SectionTitle>
              <input
                type="tel"
                aria-label="Contact phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(780) 555-0123"
                className="mt-3 w-full rounded-2xl border border-cream-line bg-white/50 px-4 py-3.5 text-base text-ink outline-none placeholder:text-ink-mute focus:border-gold"
              />
            </section>

            {/* Tip */}
            <section>
              <SectionTitle>Tip your driver</SectionTitle>
              <p className="mt-1 text-xs text-ink-mute">100% goes to the driver.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {TIP_PRESETS.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTip(t);
                      setCustomTip("");
                    }}
                    className={cn(
                      "min-h-11 rounded-full border px-5 py-2.5 text-sm font-semibold",
                      tip === t && customTip === ""
                        ? "border-gold bg-gold/10 text-ink"
                        : "border-cream-line bg-white/50 text-ink-mute",
                    )}
                  >
                    {t === 0 ? "No tip" : money(t)}
                  </button>
                ))}
                <input
                  inputMode="decimal"
                  aria-label="Custom tip amount"
                  value={customTip}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^\d.]/g, "");
                    setCustomTip(v);
                    const parsed = parseFloat(v);
                    setTip(Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : 0);
                  }}
                  placeholder="Custom"
                  className="w-28 rounded-full border border-cream-line bg-white/50 px-4 py-2.5 text-base text-ink outline-none placeholder:text-ink-mute focus:border-gold"
                />
              </div>
            </section>

            {/* Promo + points */}
            <section className="grid gap-4 sm:grid-cols-2">
              <div>
                <SectionTitle>Promo code</SectionTitle>
                <input
                  aria-label="Promo code"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="mt-3 w-full rounded-2xl border border-cream-line bg-white/50 px-4 py-3.5 text-base uppercase tracking-wide text-ink outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-mute focus:border-gold"
                />
              </div>
              <div>
                <SectionTitle>Taeam Points</SectionTitle>
                {maxRedeemable >= 1000 ? (
                  <button
                    onClick={() => setUsePoints(!usePoints)}
                    className={cn(
                      "mt-3 flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-semibold",
                      usePoints
                        ? "border-gold bg-gold/10 text-ink"
                        : "border-cream-line bg-white/50 text-ink-mute",
                    )}
                  >
                    <span>Redeem {maxRedeemable.toLocaleString()} pts</span>
                    <span className="text-green">−{money(maxRedeemable / 1000)}</span>
                  </button>
                ) : (
                  <p className="mt-3 rounded-2xl border border-cream-line bg-white/50 px-4 py-3.5 text-sm text-ink-mute">
                    {pointsBalance.toLocaleString()} pts. 1,000 needed to redeem
                  </p>
                )}
              </div>
            </section>

            {/* Note */}
            <section>
              <SectionTitle>Order note</SectionTitle>
              <textarea
                aria-label="Order note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                maxLength={300}
                placeholder="Buzzer code, landmarks, anything the kitchen or driver should know…"
                className="mt-3 w-full resize-none rounded-2xl border border-cream-line bg-white/50 p-4 text-base text-ink outline-none placeholder:text-ink-mute focus:border-gold"
              />
            </section>

            {/* Estimate */}
            {estimate && (
              <section className="rounded-3xl bg-white/60 p-6 shadow-card">
                <SectionTitle>Estimated total</SectionTitle>
                <dl className="mt-4 space-y-1.5 text-sm">
                  <Row label="Subtotal" value={money(cart.subtotal)} />
                  {pointsToRedeem > 0 && (
                    <Row label="Points" value={`−${money(pointsToRedeem / 1000)}`} accent />
                  )}
                  {orderType === "delivery" && (
                    <Row label="Delivery" value={money(estimate.deliveryFee)} />
                  )}
                  {estimate.serviceFee > 0 && (
                    <Row label="Service fee" value={money(estimate.serviceFee)} />
                  )}
                  {estimate.smallCartFee > 0 && (
                    <Row label="Small order fee" value={money(estimate.smallCartFee)} />
                  )}
                  <Row label="GST" value={money(estimate.tax)} />
                  {tip > 0 && <Row label="Tip" value={money(tip)} />}
                  <div className="flex justify-between border-t border-cream-line pt-2 text-base font-semibold text-ink">
                    <dt>Total</dt>
                    <dd>{money(estimate.total)}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs text-ink-mute">
                  Estimate. The exact total (with any promo) is confirmed on the
                  payment screen before you&rsquo;re charged.
                </p>
              </section>
            )}

            {error && (
              <p className="rounded-2xl bg-red/10 p-4 text-sm font-medium text-red">
                {error}
              </p>
            )}

            <button
              onClick={startPayment}
              disabled={!readyToPay || busy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-base font-semibold text-ink transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy && <CircleNotch className="h-5 w-5 animate-spin" aria-hidden />}
              Continue to payment
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <section className="rounded-3xl bg-white/60 p-6 shadow-card">
              <SectionTitle>Confirmed total</SectionTitle>
              <dl className="mt-4 space-y-1.5 text-sm">
                <Row label="Subtotal" value={money(paying.breakdown.subtotal)} />
                {paying.breakdown.promoDiscount > 0 && (
                  <Row
                    label={`Promo ${promo.trim().toUpperCase()}`}
                    value={`−${money(paying.breakdown.promoDiscount)}`}
                    accent
                  />
                )}
                {paying.breakdown.pointsDiscount > 0 && (
                  <Row
                    label="Points"
                    value={`−${money(paying.breakdown.pointsDiscount)}`}
                    accent
                  />
                )}
                {paying.breakdown.deliveryFee > 0 ? (
                  <Row label="Delivery" value={money(paying.breakdown.deliveryFee)} />
                ) : paying.breakdown.plusApplied ? (
                  <Row label="Delivery (Plus)" value="Free" accent />
                ) : null}
                {paying.breakdown.serviceFee > 0 && (
                  <Row label="Service fee" value={money(paying.breakdown.serviceFee)} />
                )}
                {paying.breakdown.smallCartFee > 0 && (
                  <Row
                    label="Small order fee"
                    value={money(paying.breakdown.smallCartFee)}
                  />
                )}
                <Row label="GST" value={money(paying.breakdown.tax)} />
                {paying.breakdown.tipAmount > 0 && (
                  <Row label="Tip" value={money(paying.breakdown.tipAmount)} />
                )}
                <div className="flex justify-between border-t border-cream-line pt-2 text-base font-semibold text-ink">
                  <dt>Total</dt>
                  <dd>{money(paying.breakdown.grandTotal)}</dd>
                </div>
              </dl>
            </section>

            {stripeObj ? (
              <Elements
                stripe={stripeObj}
                options={{
                  clientSecret: paying.clientSecret,
                  appearance: {
                    variables: {
                      colorPrimary: "#121212",
                      colorBackground: "#faf6ee",
                      colorText: "#121212",
                      borderRadius: "14px",
                      fontFamily: "Montserrat, system-ui, sans-serif",
                    },
                  },
                }}
              >
                <PayForm
                  amountLabel={money(paying.breakdown.grandTotal)}
                  onPaid={(paymentIntentId) =>
                    placeOrder(paymentIntentId, paying.breakdown, paying.orderId)
                  }
                  onBack={() => setPaying(null)}
                />
              </Elements>
            ) : (
              <div className="mt-4 rounded-3xl bg-red/10 p-6 text-center">
                <p className="text-sm font-medium text-red">
                  We couldn&rsquo;t load secure payments. Check your connection
                  and try again in a moment.
                </p>
                <button
                  onClick={() => setPaying(null)}
                  className="mt-4 rounded-full border border-cream-line bg-cream px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink-soft transition-colors hover:bg-cream-deep"
                >
                  Back to order details
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto min-h-[70svh] max-w-6xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        {children}
      </main>
      <Footer />
    </>
  );
}

function GateCard({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="font-black uppercase tracking-tight text-3xl text-ink">{title}</h1>
      <p className="mt-3 text-ink-mute">{body}</p>
      <Link
        href={cta.href}
        className="mt-8 inline-block rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-ink"
      >
        {cta.label}
      </Link>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-mute">
      {children}
    </h2>
  );
}

function Row({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-mute">{label}</dt>
      <dd className={cn("font-medium", accent ? "text-green" : "text-ink")}>{value}</dd>
    </div>
  );
}

function PayForm({
  amountLabel,
  onPaid,
  onBack,
}: {
  amountLabel: string;
  onPaid: (paymentIntentId: string) => Promise<void>;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const paidId = useRef<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);
    try {
      if (!paidId.current) {
        const { error: payError, paymentIntent } = await stripe.confirmPayment({
          elements,
          redirect: "if_required",
          confirmParams: { return_url: window.location.href },
        });
        if (payError) {
          setError(payError.message ?? "Payment didn't go through. Try again.");
          return;
        }
        if (!paymentIntent || !["succeeded", "requires_capture"].includes(paymentIntent.status)) {
          setError("Payment didn't complete. You have not been charged.");
          return;
        }
        paidId.current = paymentIntent.id;
      }
      // Card is authorized from here on; retries only re-run the order save.
      setPlacing(true);
      await onPaid(paidId.current);
    } catch (e) {
      setError(
        e instanceof Error
          ? `Your payment is authorized, but saving the order failed: ${e.message}. Press the button to retry (you will NOT be charged twice).`
          : "Order save failed. Retry below.",
      );
    } finally {
      setBusy(false);
      setPlacing(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6">
      <PaymentElement />
      {error && (
        <p className="mt-4 rounded-2xl bg-red/10 p-4 text-sm font-medium text-red">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy || !stripe}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-base font-semibold text-ink transition-transform hover:-translate-y-px disabled:opacity-60"
      >
        {busy && <CircleNotch className="h-5 w-5 animate-spin" aria-hidden />}
        {placing
          ? "Placing your order…"
          : paidId.current
            ? "Retry placing order"
            : `Pay ${amountLabel}`}
      </button>
      {!paidId.current && (
        <button
          type="button"
          onClick={onBack}
          className="mt-3 w-full text-center text-sm font-medium text-ink-mute underline-offset-4 hover:text-ink hover:underline"
        >
          Back to order details
        </button>
      )}
    </form>
  );
}
