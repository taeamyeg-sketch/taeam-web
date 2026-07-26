"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, NavigationArrow, CircleNotch, MapPin } from "@phosphor-icons/react";
import { AddressAutocomplete, type PickedAddress } from "@/components/AddressAutocomplete";
import { usePageTransition } from "@/components/transition/PageTransition";
import { checkDeliveryZone } from "@/lib/zones";
import { useLocation as useStoredLocation } from "@/lib/location-store";
import { SEALED } from "@/lib/launch";
import { HeroWaitlist } from "@/components/marketing/HeroWaitlist";

/**
 * The home hero: taeam.ca's real diagonal split. Flat mustard gold on the
 * upper-left, deep near-black on the lower-right, split by the brand's signature
 * cut. Bold uppercase TAEAM on the gold, giant gold طعام on the black. The black
 * triangle now carries the founder's hero.mp4 (clipped to the diagonal) instead
 * of cut-out dishes. This is the launch surface: pick an address, find food.
 */
type Status =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "out-of-zone" };

export function MarketingHero() {
  // Diagonal-wipe navigation into the ordering surface (see PageTransition).
  const { navigate } = usePageTransition();
  const [savedLoc, setLoc] = useStoredLocation();
  const [picked, setPicked] = useState<PickedAddress | null>(null);
  const [changing, setChanging] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [typed, setTyped] = useState("");
  const [nudge, setNudge] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reduced-motion users get the poster frame, not a looping video.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const v = videoRef.current;
      if (!v) return;
      if (mq.matches) v.pause();
      else v.play().catch(() => {});
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  async function proceed(a: PickedAddress) {
    setPicked(a);
    setStatus({ kind: "checking" });
    try {
      const zone = await checkDeliveryZone(a.lat, a.lng);
      setLoc({ lat: a.lat, lng: a.lng, text: a.text, zone: zone?.id });
      if (zone) {
        navigate("/restaurants");
      } else {
        setStatus({ kind: "out-of-zone" });
      }
    } catch {
      // Zone lookup failed: don't trap the user, just let them browse.
      setLoc({ lat: a.lat, lng: a.lng, text: a.text });
      navigate("/restaurants");
    }
  }

  function useLocation() {
    if (!navigator.geolocation) {
      navigate("/restaurants");
      return;
    }
    setStatus({ kind: "checking" });
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        proceed({
          text: "My current location",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => navigate("/restaurants"),
      { timeout: 10000 },
    );
  }

  const checking = status.kind === "checking";

  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-gold-bright">
      {/* Dark diagonal (lower-right): the taeam.ca signature cut. The black
          triangle now carries the founder's hero.mp4 instead of cut-out dishes,
          clipped to the diagonal by diag-mask so the video only fills the noir
          side and the gold upper-left stays flat. A soft scrim keeps the Arabic
          mark and address field readable over the moving frames. */}
      <div aria-hidden className="diag-mask pointer-events-none absolute inset-0 bg-noir">
        {/* object-contain keeps the whole frame visible (zoomed out). The video
            picture is a rectangle anchored bottom-right; its left edge is masked
            to transparent so the identical --color-noir (#0f0f0f) behind shows
            through. The picture doesn't END at a line, it DISSOLVES — the left
            of the wedge simply becomes the black split. Wide, eased transparent
            zone so it stays seamless across viewport widths. */}
        {/* Phones (<md): the letterboxed strip was invisible behind the address
            card, so the video is instead a full-width band filling the lower
            wedge, cropped with object-cover. md+ keeps the exact desktop
            composition: zoomed-out contain, bottom-right, left-fade mask
            (.hero-video-fade in globals.css). */}
        <video
          ref={videoRef}
          className="hero-video-fade absolute inset-x-0 bottom-0 h-[62%] w-full object-cover object-[center_bottom] opacity-90 md:inset-0 md:h-full md:object-contain md:object-[right_bottom]"
          src="/hero.mp4"
          poster="/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
        />
        {/* Phone blends (md+ uses the mask instead). The `to bottom right`
            gradient runs parallel to the corner-to-corner diagonal, so the
            picture dissolves into noir before it can touch the gold cut —
            same "dissolve, don't end" move as the desktop mask. */}
        <div className="absolute inset-0 bg-gradient-to-br from-noir via-noir/30 to-transparent md:hidden" />
        {/* And the band's top edge melts upward into the black. */}
        <div className="absolute inset-x-0 top-[38%] h-28 bg-gradient-to-b from-noir via-noir/60 to-transparent md:hidden" />
        {/* Whisper of an overall scrim keeps the gold طعام readable over the
            brighter frames without flattening the video into dead black. */}
        <div className="absolute inset-0 bg-noir/15" />
      </div>

      {/* Phone-only: a firmer scrim under the bottom stack so the gold "50% off"
          headline and its subtext read over the bright burger frames instead of
          camouflaging into them. md+ keeps its lighter composition (the offer
          sits over the darker side there, so it needs no extra help). Behind the
          text (z-[1]) and the address/offer container (z-40). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/2 bg-gradient-to-t from-noir via-noir/70 to-transparent md:hidden"
      />

      {/* TAEAM, black, upper-left over the gold */}
      <div
        className="rise absolute left-[7%] top-[19%] z-10 md:left-[12%]"
        style={{ animationDelay: "0ms" }}
      >
        <h1 className="font-sans text-[15vw] font-black uppercase leading-none tracking-tighter text-noir sm:text-[11vw] md:text-[8vw]">
          Taeam
        </h1>
        <p className="mt-2 text-sm font-bold uppercase tracking-tight text-noir/70 md:text-xl">
          Taste the trust
        </p>
      </div>

      {/* Arabic, gold, lower-right over the black. md+ only — on phones the
          mark lives inside the bottom address stack (below) so it can never
          collide with the card. Hidden on very short landscape viewports. */}
      <div
        className="rise absolute z-10 hidden text-right md:block md:bottom-[32%] md:right-[12%] [@media(max-height:480px)]:hidden"
        style={{ animationDelay: "120ms" }}
      >
        <p
          className="text-[13vw] font-black leading-none text-gold-bright sm:text-[10vw] md:text-[9vw]"
          style={{
            textShadow: "0 6px 40px rgba(0,0,0,0.55)",
            fontFamily: "var(--font-arabic)",
          }}
          lang="ar"
          dir="rtl"
        >
          طعام
        </p>
        <span
          className="mt-1 inline-block text-base font-semibold tracking-[0.06em] text-gold-bright/70 md:text-xl"
          style={{ fontFamily: "var(--font-arabic)" }}
          lang="ar"
          dir="rtl"
        >
          طعم الثقة
        </span>
      </div>

      {/* Address search, compact, bottom center over the black side */}
      <div
        className="rise absolute inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-center gap-2 px-4 md:bottom-14"
        style={{ animationDelay: "240ms" }}
      >
        {/* Phones: the mark rides directly above the address stack, so it
            clears the card no matter which state (pill / resume / out-of-zone)
            is showing or how short the screen is. Kept toward the right so the
            glyph stays on the black side of the diagonal. */}
        <div className="mb-1 w-full pr-[6%] text-right md:hidden [@media(max-height:480px)]:hidden">
          <p
            className="text-[11vw] font-black leading-none text-gold-bright"
            style={{
              textShadow: "0 6px 40px rgba(0,0,0,0.55)",
              fontFamily: "var(--font-arabic)",
            }}
            lang="ar"
            dir="rtl"
          >
            طعام
          </p>
          <span
            className="mt-1 inline-block text-sm font-semibold tracking-[0.06em] text-gold-bright/70"
            style={{ fontFamily: "var(--font-arabic)" }}
            lang="ar"
            dir="rtl"
          >
            طعم الثقة
          </span>
        </div>
        {SEALED ? (
          <HeroWaitlist />
        ) : status.kind === "out-of-zone" ? (
          <div className="w-full max-w-md rounded-2xl bg-cream p-5 text-center shadow-2xl">
            <p className="text-sm font-semibold text-ink">
              We&apos;re not in your area yet. Edmonton first, everywhere else soon.
            </p>
            <button
              onClick={() => navigate("/restaurants")}
              className="mt-3 w-full rounded-full bg-gold-bright px-6 py-3 text-sm font-bold uppercase tracking-wide text-noir transition-transform hover:-translate-y-px"
            >
              Look around anyway
            </button>
          </div>
        ) : savedLoc && !changing ? (
          /* Resume: the address is remembered, so don't make them redo it. */
          <div className="w-full max-w-md rounded-2xl bg-cream p-4 text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.65)]">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute">
              <MapPin weight="fill" className="h-3.5 w-3.5 text-gold-deep" />
              Delivering to
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-ink">
              {savedLoc.text}
            </p>
            <button
              onClick={() => navigate("/restaurants")}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-noir px-6 py-3 text-sm font-bold uppercase tracking-wide text-gold-bright transition-transform hover:-translate-y-px"
            >
              Browse kitchens
              <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
            </button>
            <button
              onClick={() => setChanging(true)}
              className="mt-1 inline-flex min-h-11 items-center px-3 text-xs font-semibold uppercase tracking-wide text-ink-mute transition-colors hover:text-ink"
            >
              Change address
            </button>
          </div>
        ) : (
          <>
            {/* One unified pill: address field + inline Find food button.
                Capped to the viewport so the button never clips on small phones. */}
            <div className="flex w-full max-w-[min(32rem,calc(100vw-2rem))] items-center gap-1.5 rounded-full bg-white p-1.5 pl-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.65)] ring-1 ring-black/5">
              <AddressAutocomplete
                onPick={proceed}
                onQueryChange={(q) => {
                  setTyped(q);
                  setNudge(false);
                }}
                placeholder="Enter your delivery address"
                dropUp
                className="min-w-0 flex-1"
                fieldClassName="py-1.5"
                inputClassName="text-base font-medium text-black placeholder:text-gray-400"
              />
              <button
                onClick={() => {
                  if (picked) return proceed(picked);
                  // Typed an address but never tapped a suggestion: nudge them to
                  // pick one instead of silently firing the GPS prompt (the old
                  // behaviour surprised anyone who typed and hit the button).
                  if (typed.trim().length >= 3) return setNudge(true);
                  useLocation();
                }}
                disabled={checking}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-noir px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-gold-bright transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-70 sm:px-5"
              >
                {checking ? (
                  <CircleNotch className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <>
                    Find food
                    <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
                  </>
                )}
              </button>
            </div>
            {nudge && (
              <p className="text-xs font-semibold text-gold-bright">
                Pick your address from the list to continue.
              </p>
            )}
            <button
              onClick={useLocation}
              className="inline-flex min-h-11 items-center gap-1.5 px-3 text-xs font-semibold uppercase tracking-wide text-white/75 transition-colors hover:text-white"
            >
              <NavigationArrow className="h-4 w-4" aria-hidden />
              Use my current location
            </button>
          </>
        )}
      </div>
    </section>
  );
}
