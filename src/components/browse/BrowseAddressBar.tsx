"use client";

import { useEffect, useRef, useState } from "react";
import { CaretDown, MapPin, NavigationArrow, CircleNotch } from "@phosphor-icons/react";
import {
  AddressAutocomplete,
  type PickedAddress,
} from "@/components/AddressAutocomplete";
import { useOrderMode } from "@/lib/mode-store";
import { ModeToggle } from "./ModeToggle";
import { cn } from "@/lib/cn";

/**
 * The browse header's location control. The delivery/pickup switch is the anchor
 * on top — it's the decision that reframes the whole page — and the address sits
 * quietly beneath it as a small secondary line that opens the Google-backed
 * autocomplete popover. Replaces the old cramped single-line "Deliver to …" pill.
 */
export function BrowseAddressBar({
  text,
  onPick,
}: {
  text: string | null;
  onPick: (a: PickedAddress) => void;
  outOfZone?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [mode, setMode] = useOrderMode();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function pick(a: PickedAddress) {
    setOpen(false);
    onPick(a);
  }

  function useMyLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        pick({
          text: "My current location",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => setLocating(false),
      { timeout: 10000 },
    );
  }

  return (
    <div ref={box} className="relative">
      <div className="flex min-w-0 flex-col items-start gap-1">
        <ModeToggle mode={mode} onChange={setMode} />

        {/* Address — small, secondary, opens the picker */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="group flex min-w-0 max-w-full items-center gap-1 rounded-full py-1 pl-1.5 pr-1 text-left"
        >
          <MapPin
            weight="fill"
            className="h-3 w-3 shrink-0 text-gold-deep"
            aria-hidden
          />
          <span className="hidden shrink-0 text-[10px] font-bold uppercase tracking-wide text-ink-mute sm:inline">
            {mode === "pickup" ? "Pickup near" : "Deliver to"}
          </span>
          <span className="max-w-[38vw] truncate text-xs font-semibold text-ink underline-offset-2 group-hover:underline sm:max-w-[190px]">
            {text ?? "Set address"}
          </span>
          <CaretDown
            className={cn(
              "h-3 w-3 shrink-0 text-ink-mute transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </div>

      {open && (
        // Phones: fixed + inset so the popover can't clip against the fixed
        // header's edges. sm+: anchored under the trigger as before.
        <div className="fixed inset-x-4 top-[5.5rem] z-50 rounded-2xl border border-cream-line bg-cream p-3 shadow-card sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2 sm:w-[380px]">
          <div className="flex items-center gap-2 rounded-full border border-cream-line bg-cream-deep px-3.5 py-2.5">
            <AddressAutocomplete
              onPick={pick}
              autoFocus
              placeholder="Enter a new address"
              className="flex-1"
              inputClassName="text-base text-ink placeholder:text-ink-mute"
            />
          </div>
          <button
            onClick={useMyLocation}
            disabled={locating}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-cream-deep disabled:opacity-60"
          >
            {locating ? (
              <CircleNotch className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <NavigationArrow className="h-4 w-4 text-gold-deep" aria-hidden />
            )}
            Use my current location
          </button>
        </div>
      )}
    </div>
  );
}
