"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { useAuth } from "@/components/auth/AuthContext";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { money } from "@/lib/format";
import { cn } from "@/lib/cn";

interface OrderRow {
  id: string;
  restaurant_id: string;
  status: string;
  total: number | null;
  created_at: string;
  restaurants: { name: string } | null;
}

const ACTIVE_STATUSES = new Set([
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivering",
]);

// Plain-language label + status colour for each order state. Same palette as
// the apps: waiting = gold, kitchen = blue, on its way = green, done = grey,
// stopped = red. Unknown states never show the raw database value.
const STATUS: Record<string, { label: string; dot: string }> = {
  pending: { label: "Waiting for restaurant", dot: "bg-gold" },
  awaiting_restaurant: { label: "Waiting for restaurant", dot: "bg-gold" },
  awaiting_payment: { label: "Awaiting payment", dot: "bg-gold" },
  confirmed: { label: "Confirmed", dot: "bg-[#3B6EA8]" },
  accepted: { label: "Accepted", dot: "bg-[#3B6EA8]" },
  preparing: { label: "Preparing", dot: "bg-[#3B6EA8]" },
  ready: { label: "Ready", dot: "bg-[#2F7D55]" },
  picked_up: { label: "Picked up", dot: "bg-[#2F7D55]" },
  delivering: { label: "On the way", dot: "bg-[#2F7D55]" },
  arrived: { label: "Arrived", dot: "bg-[#2F7D55]" },
  delivered: { label: "Delivered", dot: "bg-[#6B6B6B]" },
  completed: { label: "Completed", dot: "bg-[#6B6B6B]" },
  cancelled: { label: "Cancelled", dot: "bg-[#C0392B]" },
  canceled: { label: "Cancelled", dot: "bg-[#C0392B]" },
  rejected: { label: "Declined", dot: "bg-[#C0392B]" },
  refunded: { label: "Refunded", dot: "bg-[#C0392B]" },
  failed: { label: "Failed", dot: "bg-[#C0392B]" },
};

function statusInfo(status: string): { label: string; dot: string } {
  return STATUS[status] ?? { label: "In progress", dot: "bg-[#6B6B6B]" };
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);

  useEffect(() => {
    if (!user) return;
    supabaseBrowser()
      .from("orders")
      .select("id,restaurant_id,status,total,created_at,restaurants(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => setOrders((data as unknown as OrderRow[]) ?? []));
  }, [user]);

  return (
    <AccountShell>
      {orders === null ? (
        <p className="py-16 text-center text-sm text-ink-mute">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-black uppercase tracking-tight text-xl text-ink">
            No orders yet.
          </p>
          <p className="mt-2 text-sm text-ink-mute">
            Your first one is a few taps away.
          </p>
          <Link
            href="/restaurants"
            className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink"
          >
            Browse restaurants
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const active = ACTIVE_STATUSES.has(order.status);
            const status = statusInfo(order.status);
            const placed = new Date(order.created_at).toLocaleString("en-CA", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZone: "America/Edmonton",
            });
            return (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/60 p-5 shadow-card"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-ink">
                    {order.restaurants?.name ?? "Restaurant"}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-mute">
                    {placed}
                    {order.total != null && <> · {money(order.total)}</>}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cream-line px-2.5 py-1 text-xs font-semibold text-ink-soft">
                    <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                    {status.label}
                  </span>
                  {active ? (
                    <Link
                      href={`/track?id=${order.id}`}
                      className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream"
                    >
                      Track live
                    </Link>
                  ) : (
                    <Link
                      href={`/restaurant/${order.restaurant_id}`}
                      className="inline-flex min-h-11 items-center rounded-full border border-cream-line px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-cream-deep"
                    >
                      Order again
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AccountShell>
  );
}
