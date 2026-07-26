"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TransitionLink } from "@/components/transition/PageTransition";
import { useAuth } from "@/components/auth/AuthContext";
import { SiteMenu } from "@/components/SiteMenu";
import { AccountMenu } from "@/components/AccountMenu";
import { BrowseAddressBar } from "@/components/browse/BrowseAddressBar";
import { PrayerChip } from "@/components/browse/PrayerChip";
import { useLocation } from "@/lib/location-store";
import { openAuth } from "@/lib/auth-modal";
import { cn } from "@/lib/cn";
import { SEALED } from "@/lib/launch";
import { openWaitlist } from "@/lib/waitlist-modal";

// The primary taeam.ca surfaces, surfaced as always-visible top-nav buttons
// (desktop). On phones these collapse into the logo hub menu, which carries the
// full set. Each opens a real page that already exists in this app.
const NAV = [
  { href: "/restaurants", label: "Restaurants" },
  { href: "/arbaab", label: "Arbaab" },
  { href: "/halal", label: "Halal" },
  { href: "/drive", label: "Drive" },
];

/**
 * Site header. The logo is the hub menu (every Taeam surface); on ordering pages
 * (`browse`) it also carries the "Deliver to" address selector and a compact
 * prayer chip, so wayfinding lives here instead of stacking bands down the page.
 * `overlay` floats it transparent over a hero until you scroll.
 */
export function Header({
  overlay = false,
  overlayTone = "light",
  browse = false,
}: {
  overlay?: boolean;
  overlayTone?: "light" | "dark";
  browse?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const [loc, setLoc] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const floating = overlay && !scrolled;
  // `light` is the LOGO's tone. On the home hero it sits over the gold half, so
  // it stays dark (light === false); only a genuinely light-toned overlay flips
  // it white.
  const light = floating && overlayTone === "light";
  // The right-side controls sit over the DARK half of the diagonal hero, so while
  // floating they always want the light/branded treatment — independent of the
  // logo. (Only the home page ever floats, so this can't leak to other pages.)
  const navLight = floating;

  // Top-nav link. High-contrast in BOTH tones so it never camouflages (white over
  // the dark hero half, ink over cream once scrolled), and every hover snaps to a
  // solid black pill with white text.
  // On phones the links sit over the hero's GOLD top (the dark half is only the
  // lower wedge), so white would vanish there — keep them dark below md and only
  // go white on desktop when floating over the dark side.
  const navLink = cn(
    "rounded-full px-2.5 py-2 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-noir hover:text-white sm:px-3 sm:text-[13px]",
    navLight ? "text-ink-soft md:text-white" : "text-ink-soft",
  );

  // "Join Taeam" — the primary CTA. Always a filled, branded pill: gold-bright on
  // the dark hero, the signature noir/gold pill on cream. Never a faded link.
  const cta = cn(
    "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all sm:px-5 sm:py-2.5 sm:text-sm",
    navLight
      ? "bg-gold-bright text-noir hover:-translate-y-0.5"
      : "bg-noir text-gold-bright hover:-translate-y-0.5",
  );

  // While sealed, the ordering surface is unreachable, so drop its nav link.
  const navItems = SEALED ? NAV.filter((n) => n.href !== "/restaurants") : NAV;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        floating
          ? "bg-transparent"
          : "border-b border-cream-line bg-cream/85 backdrop-blur-md",
      )}
    >
      <div
        className={cn(
          "flex w-full items-center gap-3 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] transition-all duration-300 sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))]",
          scrolled ? "h-16" : "h-20",
        )}
      >
        {/* Left: hub menu + (browse) address */}
        <SiteMenu light={light} />
        {browse && (
          // min-w-0 lets the address truncate and yield space so the header
          // (menu + address + prayer + cart + account) never overflows on phones.
          <div className="min-w-0">
            <BrowseAddressBar
              text={loc?.text ?? null}
              onPick={(a) => setLoc({ lat: a.lat, lng: a.lng, text: a.text })}
            />
          </div>
        )}

        {/* Right cluster: page nav (desktop) + prayer + cart + join/account */}
        <nav className="ml-auto flex items-center gap-0.5 sm:gap-1.5">
          {/* Inline page links — the taeam.ca surfaces. Visible on phones too
              (minus the sealed ordering link), so Arbaab/Halal/Drive reach mobile
              instead of hiding in the logo menu. Still dropped on ordering pages
              (the browse header is address-focused). */}
          {!browse && (
            <div className="mr-1 flex items-center gap-0.5">
              {navItems.map((item) =>
                // Opening the ordering surface gets the brand wipe; the other
                // surfaces keep instant navigation.
                item.href === "/restaurants" ? (
                  <TransitionLink key={item.href} href={item.href} className={navLink}>
                    {item.label}
                  </TransitionLink>
                ) : (
                  <Link key={item.href} href={item.href} className={navLink}>
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          )}
          {/* Prayer chip shows on mobile too (it already collapses to just the
              icon + countdown below lg), so the brand anchor reaches phones. */}
          {browse && <PrayerChip lat={loc?.lat} lng={loc?.lng} light={light} />}
          {SEALED ? (
            // Desktop only: on phones the hero's own email field is the waitlist
            // entry (plus the logo menu), so this pill is dropped to de-clutter
            // and avoid a gold-on-gold camouflage at the top.
            <button
              onClick={() => openWaitlist()}
              className={cn(cta, "hidden md:inline-block")}
            >
              Join waitlist
            </button>
          ) : user ? (
            <AccountMenu light={navLight} />
          ) : (
            <button onClick={() => openAuth()} className={cta}>
              <span className="sm:hidden">Join</span>
              <span className="hidden sm:inline">Join Taeam</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
