/**
 * Meta (Facebook) pixel.
 *
 * The base code below is injected into <head> by the root layout, so it ships in
 * the served HTML of every page and runs before hydration — a visitor who lands
 * and leaves immediately is still counted. This module also holds the thin `fbq`
 * wrapper used to fire conversion events from anywhere in the app.
 *
 * The ID is not a secret (it ships in the page source of every site that runs a
 * pixel), so it is hardcoded as the default and only overridden by env. That is
 * deliberate: a build where NEXT_PUBLIC_META_PIXEL_ID happens to be unset would
 * otherwise ship with tracking silently switched off, which is exactly the kind
 * of failure nobody notices until an ad campaign has already spent money.
 */

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1669646327455135";

/**
 * Meta's standard base code, verbatim, with init + PageView appended. Rendered
 * as an inline <script> in the root layout's <head>. It self-guards on
 * `if (f.fbq) return`, so a double mount can never double-init.
 */
export const META_PIXEL_BASE_CODE = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`;

declare global {
  interface Window {
    fbq?: {
      (...args: unknown[]): void;
      queue?: unknown[];
      loaded?: boolean;
    };
  }
}

/**
 * Fire a standard pixel event. No-ops when `fbq` is missing — the script has not
 * loaded yet, an ad blocker ate it, or we are running server-side. Tracking must
 * never be able to break a signup, so nothing here throws.
 */
export function pixelTrack(
  event: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    window.fbq("track", event, params);
  } catch {
    /* tracking is best-effort, never fatal */
  }
}

/**
 * Fire a CUSTOM pixel event (`trackCustom`, not `track` — standard-event names
 * are a fixed vocabulary and anything else must go through this path or Meta
 * drops it). Same best-effort no-op contract as `pixelTrack`.
 */
export function pixelTrackCustom(
  event: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    window.fbq("trackCustom", event, params);
  } catch {
    /* tracking is best-effort, never fatal */
  }
}

/**
 * Waitlist conversion. Fired ONLY after the Supabase insert resolves as a
 * genuinely new row — never on button click, never on a validation error, and
 * never on a duplicate email (23505), so ad-side Lead counts match real rows in
 * public.waitlist. No email or other PII is sent: the browser pixel has no
 * advanced matching configured, and unhashed PII must not go over it.
 */
export function trackWaitlistLead(): void {
  pixelTrack("Lead", {
    content_name: "Launch Waitlist",
    content_category: "waitlist",
  });
}

/**
 * Driver-recruitment conversion (/drive), fired under the same rules as the
 * customer waitlist: only after the driver_signups insert resolves as new.
 *
 * Deliberately a CUSTOM event rather than the standard `CompleteRegistration`.
 * That standard event is the natural fit for customer account signup, which
 * arrives the moment SEALED flips and the auth rail goes live — spending it on
 * driver recruitment now would merge the two funnels a few months from now,
 * which is the exact problem keeping this off `Lead` was meant to avoid.
 *
 * Cost of the custom event: it cannot be picked as an ad optimization target
 * until a Custom Conversion is defined for it once in Events Manager. It still
 * collects from day one, so the history builds either way.
 */
export function trackDriverSignup(): void {
  pixelTrackCustom("DriverSignup", {
    content_name: "Driver Waitlist",
    content_category: "driver",
  });
}
