"use client";

import { Moped, Bag } from "@phosphor-icons/react";
import type { OrderMode } from "@/lib/mode-store";
import { cn } from "@/lib/cn";

export type { OrderMode };

/**
 * Segmented delivery/pickup switch — mirrors the app's home mode toggle. Lives in
 * the header above the address now, so it's sized to sit on one header line.
 */
export function ModeToggle({
  mode,
  onChange,
}: {
  mode: OrderMode;
  onChange: (m: OrderMode) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-cream-line bg-cream-deep p-0.5">
      <Segment
        active={mode === "delivery"}
        onClick={() => onChange("delivery")}
        icon={
          <Moped className="h-3.5 w-3.5" weight={mode === "delivery" ? "fill" : "regular"} />
        }
        label="Delivery"
      />
      <Segment
        active={mode === "pickup"}
        onClick={() => onChange("pickup")}
        icon={<Bag className="h-3.5 w-3.5" weight={mode === "pickup" ? "fill" : "regular"} />}
        label="Pickup"
      />
    </div>
  );
}

function Segment({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors",
        active ? "bg-ink text-cream shadow-sm" : "text-ink-mute hover:text-ink",
      )}
    >
      {icon}
      {/* Labels don't fit the phone header next to the prayer chip + CTA; the
          icons + active pill carry the state there. */}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
