"use client";

import { useEffect, useRef } from "react";

/**
 * Wires the standard modal-dialog a11y contract onto an overlay:
 *   - locks body scroll while open
 *   - Escape closes
 *   - moves focus into the panel on open (first focusable, else the panel)
 *   - traps Tab focus inside the panel
 *   - restores focus to the trigger on close
 *
 * Attach the returned ref to the dialog panel element, and give that element
 * `role="dialog"` + `aria-modal="true"` (+ `aria-label`/`aria-labelledby`).
 * `onClose` is read through a ref, so it need not be memoised by the caller.
 */
export function useModalDialog<T extends HTMLElement = HTMLDivElement>(
  onClose: () => void,
) {
  const panelRef = useRef<T>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Lock both roots: iOS Safari keeps scrolling the page behind an overlay
    // when only body has overflow:hidden.
    const prevOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null);

    // Move focus into the dialog.
    (focusables()[0] ?? panelRef.current)?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      if (els.length === 0) {
        e.preventDefault();
        return;
      }
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  return panelRef;
}
