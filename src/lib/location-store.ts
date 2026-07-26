"use client";

import { useSyncExternalStore } from "react";

export interface Loc {
  lat: number;
  lng: number;
  text: string;
  zone?: string;
}

const KEY = "taeam.location";
const EVENT = "taeam:location";

/**
 * One source of truth for the chosen delivery address, shared between the header
 * (the "Deliver to" selector + prayer chip) and the browse page (distance sort).
 * Backed by localStorage so it also survives reloads and matches what the hero
 * stored, and broadcast via a window event so every subscriber updates at once.
 */
export function setLocation(loc: Loc) {
  try {
    localStorage.setItem(KEY, JSON.stringify(loc));
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

// Cache so getSnapshot returns a stable reference unless the stored value
// actually changed (required by useSyncExternalStore).
let cache: { raw: string | null; val: Loc | null } = { raw: null, val: null };

function getSnapshot(): Loc | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    /* ignore */
  }
  if (raw !== cache.raw) {
    let val: Loc | null = null;
    try {
      val = raw ? (JSON.parse(raw) as Loc) : null;
    } catch {
      val = null;
    }
    cache = { raw, val };
  }
  return cache.val;
}

export function useLocation(): [Loc | null, (l: Loc) => void] {
  const loc = useSyncExternalStore(subscribe, getSnapshot, () => null);
  return [loc, setLocation];
}
