"use client";

import Image from "next/image";
import { useState } from "react";
import { Flame, Leaf, Minus, Plus, X } from "@phosphor-icons/react";
import { money } from "@/lib/format";
import { openStatus } from "@/lib/hours";
import type { MenuItem, Restaurant } from "@/lib/types";
import { useModalDialog } from "@/lib/useModalDialog";
import { useCart } from "../cart/CartContext";

/** Item detail: bottom sheet on mobile, centred card on desktop. */
export function ItemSheet({
  item,
  restaurant,
  onClose,
}: {
  item: MenuItem;
  restaurant: Restaurant;
  onClose: () => void;
}) {
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const panelRef = useModalDialog<HTMLDivElement>(onClose);
  const status = openStatus(restaurant);

  function addToCart() {
    cart.add(
      {
        id: restaurant.id,
        name: restaurant.name,
        deliveryFee: restaurant.delivery_fee,
      },
      {
        itemId: item.id,
        name: item.name,
        price: item.price,
        qty,
        note: note.trim() || undefined,
        imageUrl: item.image_url,
        category: item.category,
      },
    );
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        className="relative max-h-[88svh] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-cream shadow-sheet sm:max-w-lg sm:rounded-3xl"
      >
        {item.image_url && (
          <div className="relative aspect-[16/9] w-full bg-cream-deep">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              sizes="(min-width: 640px) 32rem, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full bg-cream/90 p-3 text-ink shadow-card"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:p-6">
          <h2 className="pr-8 font-black tracking-tight text-2xl text-ink">
            {item.name}
          </h2>
          <p className="mt-1.5 flex items-center gap-2 text-lg font-semibold text-ink">
            {money(item.price)}
            {item.is_spicy && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-red">
                <Flame weight="fill" className="h-4 w-4" /> Spicy
              </span>
            )}
            {(item.is_vegetarian || item.is_vegan) && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green">
                <Leaf weight="fill" className="h-4 w-4" />
                {item.is_vegan ? "Vegan" : "Vegetarian"}
              </span>
            )}
          </p>
          {item.description && (
            <p className="mt-3 text-[15px] leading-relaxed text-ink-mute">
              {item.description}
            </p>
          )}

          {/* Options are display-only for now: web checkout charges the base
              price and can't yet capture a selection, so we present them as
              menu information rather than as controls that ignore a tap. */}
          {item.options?.map((group) => (
            <div key={group.name} className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-mute">
                {group.name}
              </p>
              <ul className="mt-1.5 space-y-1 text-sm text-ink-soft">
                {group.choices?.map((choice) => (
                  <li
                    key={choice.name}
                    className="flex items-center justify-between"
                  >
                    <span>{choice.name}</span>
                    {choice.price ? (
                      <span className="text-ink-mute">+{money(choice.price)}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-ink">
              Special instructions
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={200}
              placeholder="Extra sauce, no onions…"
              className="mt-2 w-full resize-none rounded-xl border border-cream-line bg-cream p-3 text-base text-ink outline-none placeholder:text-ink-mute focus:border-gold"
            />
          </label>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-cream-line bg-cream-deep px-1.5 py-1">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="rounded-full p-2.5 text-ink hover:bg-cream"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-semibold">{qty}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQty(qty + 1)}
                className="rounded-full p-2.5 text-ink hover:bg-cream"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={addToCart}
              disabled={!status.open}
              className={
                status.open
                  ? "flex-1 rounded-full bg-gold px-5 py-3.5 text-base font-semibold text-ink transition-transform hover:-translate-y-px"
                  : "flex-1 rounded-full bg-cream-deep px-5 py-3.5 text-base font-semibold text-ink-mute"
              }
            >
              {status.open
                ? `Add to order · ${money(item.price * qty)}`
                : `Closed · ${status.label}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
