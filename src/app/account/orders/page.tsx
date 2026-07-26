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

function statusStyle(status: string): string {
  if (ACTIVE_STATUSES.has(status)) return "bg-gold/15 text-gold-deep";
  if (status === "delivered") return "bg-green/10 text-green";
  return "bg-cream-deep text-ink-mute";
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
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/60 p-5 shadow-card"
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
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                      statusStyle(order.status),
                    )}
                  >
                    {order.status.replace(/_/g, " ")}
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
