"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle, Phone } from "@phosphor-icons/react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Rule } from "@/components/Pattern";
import { useAuth } from "@/components/auth/AuthContext";
import { LiveMap, type MapPin } from "@/components/track/LiveMap";
import { requestRoute } from "@/lib/api";
import { money } from "@/lib/format";
import { decodePolyline } from "@/lib/polyline";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { cn } from "@/lib/cn";

interface TrackedOrder {
  id: string;
  status: string;
  restaurant_id: string;
  restaurant_name: string | null;
  restaurant_lat: number | null;
  restaurant_lng: number | null;
  customer_lat: number | null;
  customer_lng: number | null;
  delivery_address: string | null;
  items: { name: string; quantity: number; price: number }[] | null;
  total: number | null;
  driver_id: string | null;
  courier_location: { lat: number; lng: number } | null;
  route_polyline: string | null;
  route_eta_seconds: number | null;
  order_type: string | null;
  created_at: string;
}

interface DriverRow {
  name: string | null;
  phone: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_color: string | null;
  license_plate: string | null;
  profile_photo_url: string | null;
}

const STEPS = [
  { key: "placed", label: "Order placed" },
  { key: "kitchen", label: "In the kitchen" },
  { key: "road", label: "On the way" },
  { key: "done", label: "Delivered" },
] as const;

function stepIndex(status: string, orderType: string | null): number {
  if (["pending"].includes(status)) return 0;
  if (["confirmed", "preparing"].includes(status)) return 1;
  if (
    ["ready", "ready_for_pickup", "driver_assigned", "picked_up", "delivering"].includes(
      status,
    )
  )
    return 2;
  if (["delivered", "completed"].includes(status)) return 3;
  return 0;
}

function TrackInner() {
  const params = useSearchParams();
  const orderId = params.get("id");
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [driver, setDriver] = useState<DriverRow | null>(null);
  const [missing, setMissing] = useState(false);
  const routeRequested = useRef(false);

  const SELECT =
    "id,status,restaurant_id,restaurant_name,restaurant_lat,restaurant_lng,customer_lat,customer_lng,delivery_address,items,total,driver_id,courier_location,route_polyline,route_eta_seconds,order_type,created_at";

  // Initial load + realtime subscription + slow safety poll.
  useEffect(() => {
    if (!orderId || !user) return;
    const supabase = supabaseBrowser();
    let cancelled = false;

    async function fetchOrder() {
      const { data } = await supabase
        .from("orders")
        .select(SELECT)
        .eq("id", orderId)
        .maybeSingle();
      if (cancelled) return;
      if (!data) setMissing(true);
      else setOrder(data as unknown as TrackedOrder);
    }
    fetchOrder();

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        (payload) => setOrder(payload.new as TrackedOrder),
      )
      .subscribe();
    const poll = setInterval(fetchOrder, 30000);

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
  }, [orderId, user]);

  // Driver profile once assigned.
  useEffect(() => {
    const driverId = order?.driver_id;
    if (!driverId) {
      setDriver(null);
      return;
    }
    supabaseBrowser()
      .from("drivers")
      .select(
        "name,phone,vehicle_make,vehicle_model,vehicle_color,license_plate,profile_photo_url",
      )
      .eq("uid", driverId)
      .maybeSingle()
      .then(({ data }) => setDriver(data as DriverRow | null));
  }, [order?.driver_id]);

  // Ask the backend for the route polyline once the kitchen confirms.
  useEffect(() => {
    if (!order || routeRequested.current) return;
    if (!order.route_polyline && !["pending", "delivered", "cancelled"].includes(order.status)) {
      routeRequested.current = true;
      requestRoute(order.id);
    }
  }, [order]);

  const pins = useMemo<MapPin[]>(() => {
    if (!order) return [];
    const list: MapPin[] = [];
    if (order.restaurant_lat && order.restaurant_lng) {
      list.push({
        id: "restaurant",
        kind: "restaurant",
        lat: order.restaurant_lat,
        lng: order.restaurant_lng,
      });
    }
    if (order.customer_lat && order.customer_lng) {
      list.push({
        id: "home",
        kind: "home",
        lat: order.customer_lat,
        lng: order.customer_lng,
      });
    }
    if (order.courier_location?.lat && order.courier_location?.lng) {
      list.push({
        id: "driver",
        kind: "driver",
        lat: order.courier_location.lat,
        lng: order.courier_location.lng,
      });
    }
    return list;
  }, [order]);

  const route = useMemo(
    () => (order?.route_polyline ? decodePolyline(order.route_polyline) : undefined),
    [order?.route_polyline],
  );

  const pin =
    typeof window !== "undefined" && orderId
      ? localStorage.getItem(`taeam.pin.${orderId}`)
      : null;

  if (!orderId) return <Gate title="No order specified." />;
  if (authLoading) return <Gate title="Loading…" />;
  if (!user)
    return (
      <Gate
        title="Sign in to track your order"
        cta={{ href: `/signin?next=/track?id=${orderId}`, label: "Sign in" }}
      />
    );
  if (missing) return <Gate title="We couldn't find that order." />;
  if (!order) return <Gate title="Loading your order…" />;

  const cancelled = ["cancelled", "canceled", "rejected"].includes(order.status);
  const current = stepIndex(order.status, order.order_type);
  const etaMin = order.route_eta_seconds
    ? Math.max(1, Math.round(order.route_eta_seconds / 60))
    : null;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-deep">
              {order.restaurant_name}
            </p>
            <h1 className="mt-2 font-black uppercase tracking-tight text-3xl text-ink sm:text-4xl">
              {cancelled
                ? "Order cancelled"
                : current === 3
                  ? "Delivered. Bon appétit!"
                  : current === 2 && order.status === "delivering"
                    ? etaMin
                      ? `Arriving in ~${etaMin} min`
                      : "Your driver is on the way"
                    : STEPS[current].label}
            </h1>
          </div>
          <Link
            href="/account/orders"
            className="text-sm font-semibold text-ink-mute underline-offset-4 hover:text-ink hover:underline"
          >
            All orders
          </Link>
        </div>

        {/* Progress */}
        {!cancelled && (
          <ol className="mt-8 grid grid-cols-4 gap-2">
            {STEPS.map((step, i) => (
              <li key={step.key}>
                <div
                  className={cn(
                    "h-1.5 rounded-full",
                    i <= current ? "bg-gold" : "bg-cream-line",
                  )}
                />
                <p
                  className={cn(
                    "mt-2 break-words text-[10px] font-semibold uppercase tracking-normal sm:text-xs sm:tracking-wide",
                    i <= current ? "text-ink" : "text-ink-mute",
                  )}
                >
                  {step.label}
                </p>
              </li>
            ))}
          </ol>
        )}

        <div className={cn("mt-8 grid gap-6", order.order_type !== "pickup" && "lg:grid-cols-[1.5fr_1fr]")}>
          {/* Map */}
          {order.order_type !== "pickup" && pins.length > 0 && (
            <LiveMap
              pins={pins}
              route={route}
              className="h-80 w-full overflow-hidden rounded-3xl shadow-card sm:h-[28rem]"
            />
          )}

          <div className="space-y-5">
            {/* PIN */}
            {pin && !cancelled && current < 3 && (
              <div className="rounded-3xl bg-ink p-6 text-cream shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  Your delivery PIN
                </p>
                <p className="mt-2 font-black text-4xl tracking-[0.3em]">
                  {pin}
                </p>
                <p className="mt-2 text-sm text-cream/70">
                  Give this to your driver at handoff. It confirms the right
                  hands got the food.
                </p>
              </div>
            )}

            {/* Driver */}
            {driver && !cancelled && current < 3 && (
              <div className="flex items-center gap-4 rounded-3xl bg-white/60 p-5 shadow-card">
                {driver.profile_photo_url ? (
                  <Image
                    src={driver.profile_photo_url}
                    alt={driver.name ?? "Driver"}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-deep font-black text-xl text-ink">
                    {(driver.name ?? "D").charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{driver.name ?? "Your driver"}</p>
                  <p className="truncate text-sm text-ink-mute">
                    {[driver.vehicle_color, driver.vehicle_make, driver.vehicle_model]
                      .filter(Boolean)
                      .join(" ")}
                    {driver.license_plate && ` · ${driver.license_plate}`}
                  </p>
                </div>
                {driver.phone && (
                  <a
                    href={`tel:${driver.phone}`}
                    aria-label="Call driver"
                    className="rounded-full bg-gold p-3 text-ink"
                  >
                    <Phone className="h-5 w-5" weight="fill" />
                  </a>
                )}
              </div>
            )}

            {/* Delivered check */}
            {current === 3 && (
              <div className="flex items-center gap-3 rounded-3xl bg-green/10 p-5 text-green">
                <CheckCircle className="h-7 w-7" weight="fill" aria-hidden />
                <p className="text-sm font-semibold">
                  Delivered{order.delivery_address ? ` to ${order.delivery_address}` : ""}.
                  Points landed in your account.
                </p>
              </div>
            )}

            {/* Order summary */}
            <div className="rounded-3xl bg-white/60 p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-mute">
                Your order
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {(order.items ?? []).map((item, i) => (
                  <li key={i} className="flex justify-between gap-3">
                    <span className="text-ink">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="text-ink-mute">
                      {money(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              {order.total != null && (
                <div className="mt-4 flex justify-between border-t border-cream-line pt-3 text-sm font-semibold text-ink">
                  <span>Total</span>
                  <span>{money(order.total)}</span>
                </div>
              )}
            </div>

            <p className="flex items-center gap-2 text-xs text-ink-mute">
              <Rule className="w-4 text-gold" />
              Updates live, no need to refresh.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Gate({
  title,
  cta,
}: {
  title: string;
  cta?: { href: string; label: string };
}) {
  return (
    <>
      <Header />
      <main className="flex min-h-[70svh] flex-col items-center justify-center px-4 pt-16 text-center">
        <h1 className="font-black uppercase tracking-tight text-3xl text-ink">{title}</h1>
        {cta && (
          <Link
            href={cta.href}
            className="mt-8 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-ink"
          >
            {cta.label}
          </Link>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackInner />
    </Suspense>
  );
}
