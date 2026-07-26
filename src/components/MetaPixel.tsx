"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Client half of the Meta pixel. The base code itself is inlined into <head> by
 * the root layout (see lib/meta-pixel META_PIXEL_BASE_CODE), which is what fires
 * the first PageView.
 *
 * This component exists for one reason: after the first load the site is a
 * single-page app, so the head snippet never runs again and every in-site
 * navigation would go uncounted. The effect re-fires PageView on each pathname
 * change, skipping the first render — the head snippet already covered the
 * landing URL, and firing again would double-count it.
 *
 * Conversion events are NOT fired here — see lib/meta-pixel `trackWaitlistLead`,
 * called from the waitlist submit path once the insert has actually succeeded.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (typeof window.fbq === "function") window.fbq("track", "PageView");
  }, [pathname]);

  return null;
}
