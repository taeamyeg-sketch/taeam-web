"use client";

/**
 * Open the global sign-in modal from anywhere (header, guest order gate, etc.).
 * `next` is where OAuth should return to. The modal (mounted in the layout)
 * listens for this event.
 */
export function openAuth(next?: string) {
  window.dispatchEvent(new CustomEvent("taeam:auth", { detail: { next } }));
}
