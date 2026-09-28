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
 * The cookie notice's answer, in localStorage. A timestamp means "OK", the
 * string "declined" means "No ad tracking", and no value means the visitor has
 * not chosen yet. Opt-out model: the pixel runs until someone declines. The
 * head snippet below reads the same key before hydration, so both literals are
 * interpolated into it rather than repeated.
 */
export const COOKIE_CONSENT_KEY = "taeam.cookie.consent";
export const AD_TRACKING_DECLINED = "declined";

/**
 * Meta's standard base code, verbatim, followed by our consent check, init and
 * PageView. Rendered as an inline <script> in the root layout's <head>. It
 * self-guards on `if (f.fbq) return`, so a double mount can never double-init.
 *
 * For a visitor who chose "No ad tracking", `consent revoke` runs BEFORE init.
 * While revoked, fbevents.js parks every call (init included) in `fbq.queue`
 * and sends nothing, and it would flush that queue if consent were ever granted
 * again. So the PageView is skipped outright rather than queued, and nothing in
 * the site ever calls `consent grant`.
 */
export const META_PIXEL_BASE_CODE = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
(function(){var d=false;
try{d=localStorage.getItem('${COOKIE_CONSENT_KEY}')==='${AD_TRACKING_DECLINED}'}catch(e){}
if(d)fbq('consent','revoke');
fbq('init', '${META_PIXEL_ID}');
if(!d)fbq('track', 'PageView');})();`;

declare global {
  interface Window {
    fbq?: {
      (...args: unknown[]): void;
      queue?: unknown[];
      loaded?: boolean;
    };
  }
}

/** True when this browser chose "No ad tracking" in the cookie notice. */
export function adTrackingDeclined(): boolean {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === AD_TRACKING_DECLINED;
  } catch {
    return false; // storage blocked: no stored choice, so the default applies
  }
}

/**
 * "No ad tracking": revoke consent so the pixel sends nothing more from this
 * page, and expire the first-party cookies it set on earlier visits (`_fbp`,
 * plus `_fbc` from an ad click). Those cookies live on the widest domain the
 * browser allowed, so each parent domain is tried; the invalid ones are
 * ignored by the browser.
 */
export function revokeAdTracking(): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.fbq === "function") window.fbq("consent", "revoke");
    const parts = window.location.hostname.split(".");
    const domains = [""];
    for (let i = 0; i < parts.length - 1; i++) {
      domains.push(`; domain=.${parts.slice(i).join(".")}`);
    }
    for (const name of ["_fbp", "_fbc"]) {
      for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d}`;
    }
  } catch {
    /* tracking is best-effort, never fatal */
  }
}

/**
 * Fire a standard pixel event. No-ops when `fbq` is missing — the script has not
 * loaded yet, an ad blocker ate it, or we are running server-side — and when
 * the visitor declined ad tracking (a call made while consent is revoked is
 * queued by fbevents.js, not dropped, so it must not be made at all). Tracking
 * must never be able to break a signup, so nothing here throws.
 */
export function pixelTrack(
  event: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (adTrackingDeclined()) return;
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
  if (adTrackingDeclined()) return;
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
