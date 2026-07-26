"use client";

import { useEffect, useRef, useState } from "react";
import { CircleNotch, MagnifyingGlass, MapPin } from "@phosphor-icons/react";
import {
  addressDetails,
  newSessionToken,
  suggestAddresses,
  type PlacePrediction,
} from "@/lib/places";
import { cn } from "@/lib/cn";

export interface PickedAddress {
  text: string;
  lat: number;
  lng: number;
}

/**
 * Google-backed address search. Debounced suggestions, keyboard nav, and a
 * single details lookup on select that returns coordinates. Degrades to a
 * plain text field if the proxy is unreachable.
 */
export function AddressAutocomplete({
  onPick,
  onQueryChange,
  placeholder = "Enter your delivery address",
  autoFocus = false,
  className,
  fieldClassName,
  inputClassName,
  leadingIcon = true,
  dropUp = false,
}: {
  onPick: (a: PickedAddress) => void;
  onQueryChange?: (q: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  fieldClassName?: string;
  inputClassName?: string;
  leadingIcon?: boolean;
  dropUp?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [preds, setPreds] = useState<PlacePrediction[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [active, setActive] = useState(-1);
  const token = useRef(newSessionToken());
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setPreds([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      const results = await suggestAddresses(q, token.current);
      setPreds(results);
      setOpen(results.length > 0);
      setActive(-1);
      setLoading(false);
    }, 220);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  async function choose(p: PlacePrediction) {
    setQuery(p.description);
    onQueryChange?.(p.description);
    setOpen(false);
    setResolving(true);
    const details = await addressDetails(p.placeId, token.current);
    token.current = newSessionToken();
    setResolving(false);
    if (details) {
      onPick({
        text: details.formattedAddress || p.description,
        lat: details.lat,
        lng: details.lng,
      });
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || preds.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, preds.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      void choose(preds[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <div className={cn("flex items-center gap-2", fieldClassName)}>
        {leadingIcon && (
          <MagnifyingGlass className="h-5 w-5 shrink-0 text-ink-mute" aria-hidden />
        )}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onQueryChange?.(e.target.value);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => preds.length > 0 && setOpen(true)}
          placeholder={placeholder}
          aria-label="Delivery address"
          autoFocus={autoFocus}
          autoComplete="off"
          className={cn("min-w-0 flex-1 bg-transparent outline-none", inputClassName)}
        />
        {(loading || resolving) && (
          <CircleNotch
            className="h-4 w-4 shrink-0 animate-spin text-ink-mute"
            aria-hidden
          />
        )}
      </div>

      {open && preds.length > 0 && (
        <ul
          className={cn(
            "absolute inset-x-0 z-50 max-h-72 overflow-y-auto overscroll-contain rounded-2xl border border-cream-line bg-cream text-left shadow-card",
            dropUp ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {preds.map((p, i) => (
            <li key={p.placeId}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(p)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition-colors",
                  i === active ? "bg-cream-deep" : "hover:bg-cream-deep",
                )}
              >
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep"
                  aria-hidden
                />
                <span className="min-w-0">
                  <span className="block font-medium text-ink">{p.mainText}</span>
                  {p.secondaryText && (
                    <span className="block truncate text-xs text-ink-mute">
                      {p.secondaryText}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
