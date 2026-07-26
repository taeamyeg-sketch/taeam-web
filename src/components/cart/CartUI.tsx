"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBagOpen, X } from "@phosphor-icons/react";
import { money } from "@/lib/format";
import { loadFeeConfig, type FeeConfig } from "@/lib/fees";
import { useAuth } from "@/components/auth/AuthContext";
import { openAuth } from "@/lib/auth-modal";
import { useModalDialog } from "@/lib/useModalDialog";
import { useCart } from "./CartContext";

/** Floating cart bar + slide-up drawer. Rendered globally; hidden when empty. */
export function CartUI() {
  const cart = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [smallCart, setSmallCart] = useState<FeeConfig["smallCart"] | null>(null);

  // Powers the "add $X to skip the small-order fee" nudge in the drawer. The
  // server stays authoritative at checkout; this is a public-config estimate
  // and falls back to defaults if the config read fails.
  useEffect(() => {
    let active = true;
    loadFeeConfig().then((cfg) => {
      if (active) setSmallCart(cfg.smallCart);
    });
    return () => {
      active = false;
    };
  }, []);

  // Guests browse and build a cart freely; sign-in is required only to order —
  // the same gate the app puts at "place order".
  function checkout() {
    cart.setOpen(false);
    if (user) router.push("/checkout");
    else openAuth("/checkout");
  }

  if (cart.count === 0) return null;

  return (
    <>
      {/* Floating bar */}
      {!cart.open && (
        <div className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 sm:inset-x-auto sm:right-6 sm:w-96">
          <button
            onClick={() => cart.setOpen(true)}
            className="flex w-full items-center justify-between rounded-full bg-ink px-5 py-3.5 text-cream shadow-card transition-transform hover:-translate-y-px"
          >
            <span className="flex items-center gap-2.5 text-sm font-semibold">
              <ShoppingBagOpen className="h-5 w-5 text-gold" aria-hidden />
              View cart · {cart.count} {cart.count === 1 ? "item" : "items"}
            </span>
            <span className="text-sm font-semibold text-gold">
              {money(cart.subtotal)}
            </span>
          </button>
        </div>
      )}

      {/* Drawer */}
      {cart.open && <CartDrawer onCheckout={checkout} smallCart={smallCart} />}
    </>
  );
}

/** The slide-up cart drawer, mounted only while open so it gets the full
 *  modal-dialog a11y contract (scroll lock, Escape, focus trap, focus return). */
function CartDrawer({
  onCheckout,
  smallCart,
}: {
  onCheckout: () => void;
  smallCart: FeeConfig["smallCart"] | null;
}) {
  const cart = useCart();
  const { user } = useAuth();
  const panelRef = useModalDialog<HTMLDivElement>(() => cart.setOpen(false));

  // Reaching threshold_high drops the small-order fee to $0 (see estimateFees
  // in lib/fees.ts). Only shown when we know the threshold and the subtotal is
  // below it — a real, client-computable number, never a fabricated one.
  const smallOrderShortfall =
    smallCart && cart.subtotal > 0 && cart.subtotal < smallCart.threshold_high
      ? Math.round((smallCart.threshold_high - cart.subtotal) * 100) / 100
      : 0;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close cart"
        tabIndex={-1}
        onClick={() => cart.setOpen(false)}
        className="absolute inset-0 bg-ink/40"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className="absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto overscroll-contain rounded-t-3xl bg-cream p-5 pb-[calc(2rem+env(safe-area-inset-bottom))] shadow-sheet sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[26rem] sm:rounded-3xl sm:pb-8"
      >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black uppercase tracking-tight text-xl text-ink">
                  Your order
                </h2>
                {cart.restaurant && (
                  <p className="text-sm text-ink-mute">{cart.restaurant.name}</p>
                )}
              </div>
              <button
                onClick={() => cart.setOpen(false)}
                aria-label="Close"
                className="rounded-full p-2 text-ink-mute hover:bg-cream-deep"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ul className="mt-4 space-y-3">
              {cart.lines.map((line) => (
                <li key={line.key} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{line.name}</p>
                    {line.note && (
                      <p className="truncate text-xs text-ink-mute">“{line.note}”</p>
                    )}
                    <p className="mt-0.5 text-sm text-ink-mute">
                      {money(line.price)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 rounded-full border border-cream-line bg-cream-deep px-1 py-0.5">
                    <button
                      aria-label="Remove one"
                      onClick={() => cart.setQty(line.key, line.qty - 1)}
                      className="rounded-full p-2.5 text-ink hover:bg-cream"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">
                      {line.qty}
                    </span>
                    <button
                      aria-label="Add one"
                      onClick={() => cart.setQty(line.key, line.qty + 1)}
                      className="rounded-full p-2.5 text-ink hover:bg-cream"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-1.5 border-t border-cream-line pt-4 text-sm">
              <div className="flex justify-between text-ink">
                <span>Subtotal</span>
                <span className="font-semibold">{money(cart.subtotal)}</span>
              </div>
              {cart.restaurant?.deliveryFee != null && (
                <div className="flex justify-between text-ink-mute">
                  <span>Delivery</span>
                  <span>{money(cart.restaurant.deliveryFee)}</span>
                </div>
              )}
              {smallOrderShortfall > 0 && (
                <p className="pt-1 text-xs font-semibold text-gold-deep">
                  Add {money(smallOrderShortfall)} more to skip the small-order fee.
                </p>
              )}
              <p className="pt-1 text-xs text-ink-mute">
                Delivery, service fee and GST calculated at checkout.
              </p>
            </div>

            <button
              onClick={onCheckout}
              className="mt-4 block w-full rounded-full bg-gold px-6 py-3.5 text-center text-base font-semibold text-ink transition-transform hover:-translate-y-px"
            >
              {user ? "Go to checkout" : "Sign in to order"}
            </button>
      </div>
    </div>
  );
}
