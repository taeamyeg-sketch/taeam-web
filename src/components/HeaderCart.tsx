"use client";

import { ShoppingBagOpen } from "@phosphor-icons/react";
import { money } from "@/lib/format";
import { useCart } from "@/components/cart/CartContext";
import { cn } from "@/lib/cn";

/**
 * Header cart button — replaces the old "Order now" CTA, which was redundant on
 * both the hero (the address field is the CTA) and the browse page (you're
 * already there). Only appears once there's something in the cart, and opens the
 * cart drawer.
 */
export function HeaderCart({ light = false }: { light?: boolean }) {
  const cart = useCart();
  if (cart.count === 0) return null;

  return (
    <button
      onClick={() => cart.setOpen(true)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5 sm:px-5 sm:py-2.5",
        light ? "bg-gold-bright text-noir" : "bg-gold text-ink shadow-sm",
      )}
    >
      <ShoppingBagOpen className="h-4 w-4" weight="fill" aria-hidden />
      <span>{cart.count}</span>
      <span className="hidden sm:inline">· {money(cart.subtotal)}</span>
    </button>
  );
}
