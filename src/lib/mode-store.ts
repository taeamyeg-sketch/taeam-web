"use client";

import { useSyncExternalStore } from "react";

export type OrderMode = "delivery" | "pickup";

const KEY = "taeam.mode";
const EVENT = "taeam:mode";

/**
 * One source of truth for delivery-vs-pickup, shared between the header (where
 * the toggle now lives, above the address) and the browse body (which switches
 * to the map + side-grid pickup view). Mirrors location-store: localStorage so
 * the choice survives a reload, plus a window event so every subscriber updates
 * at once — the two live in separate component trees and can't share useState.
 */
export function setOrderMode(mode: OrderMode) {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* private mode / storage disabled */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

// Returns a primitive, so it's reference-stable for useSyncExternalStore without
// the caching dance location-store needs for its object.
function getSnapshot(): OrderMode {
  try {
    return localStorage.getItem(KEY) === "pickup" ? "pickup" : "delivery";
  } catch {
    return "delivery";
  }
}

export function useOrderMode(): [OrderMode, (m: OrderMode) => void] {
  const mode = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => "delivery" as OrderMode,
  );
  return [mode, setOrderMode];
}
