"use client";

import { useEffect, useRef, useState } from "react";
import type * as L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * The real Edmonton, dark. A non-interactive Leaflet map on CARTO dark-matter
 * tiles (actual roads, dark register) framed wide enough that the Anthony
 * Henday ring reads around the city, with the two launch zones drawn as
 * glowing gold overlays — translucent fill so the street grid shows through
 * the "hologram".
 *
 * The zone shapes are traced from the founder's Google My Maps drawing (north:
 * the dome over Castle Downs/Griesbach/Londonderry down to the Yellowhead;
 * south: The Grange arm across Windermere/Twin Brooks/Mill Woods to Tamarack).
 * They're the marketing picture — the delivery_zones address check stays the
 * authority on what's actually deliverable.
 */

const NORTH_ZONE: [number, number][] = [
  [53.572, -113.652],
  [53.612, -113.636],
  [53.642, -113.596],
  [53.658, -113.543],
  [53.659, -113.488],
  [53.649, -113.437],
  [53.628, -113.398],
  [53.598, -113.365],
  [53.57, -113.346],
  [53.564, -113.41],
  [53.568, -113.492],
  [53.57, -113.58],
];

const SOUTH_ZONE: [number, number][] = [
  [53.518, -113.658],
  [53.518, -113.61],
  [53.516, -113.578],
  [53.494, -113.566],
  [53.492, -113.52],
  [53.494, -113.458],
  [53.496, -113.408],
  [53.492, -113.352],
  [53.48, -113.34],
  [53.461, -113.347],
  [53.453, -113.38],
  [53.451, -113.44],
  [53.45, -113.505],
  [53.444, -113.548],
  [53.449, -113.585],
  [53.462, -113.61],
  [53.478, -113.638],
  [53.5, -113.655],
];

const ZONES = [
  { name: "Edmonton North", points: NORTH_ZONE, label: [53.612, -113.498] as [number, number] },
  { name: "Edmonton South", points: SOUTH_ZONE, label: [53.472, -113.48] as [number, number] },
];

function ensureZoneStyles() {
  if (document.getElementById("tz-launch-map-styles")) return;
  const s = document.createElement("style");
  s.id = "tz-launch-map-styles";
  s.textContent = `
    .tz-map .leaflet-container{background:#0f0f0f;cursor:default;pointer-events:none;}
    .tz-map .leaflet-tile-pane{filter:brightness(1.22) contrast(1.14) saturate(.65);}
    .tz-zone{filter:drop-shadow(0 0 4px rgba(234,179,8,.85)) drop-shadow(0 0 16px rgba(234,179,8,.4));animation:tz-pulse 5s ease-in-out infinite;}
    @keyframes tz-pulse{0%,100%{opacity:1}50%{opacity:.62}}
    @media (prefers-reduced-motion: reduce){.tz-zone{animation:none}}
    .tz-zone-label{display:inline-block;transform:translate(-50%,-50%);color:#eab308;font-family:var(--font-sans),system-ui,sans-serif;font-weight:800;font-size:10px;letter-spacing:.22em;text-transform:uppercase;white-space:nowrap;text-shadow:0 0 10px rgba(234,179,8,.55),0 1px 3px rgba(0,0,0,.9);}
  `;
  document.head.appendChild(s);
}

export function LaunchZonesMap({ className }: { className?: string }) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  // The map sits well below the fold; don't pay for leaflet + tiles until the
  // visitor is actually scrolling toward it.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!el.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !el.current) return;
    let cancelled = false;
    ensureZoneStyles();

    import("leaflet").then((leaflet) => {
      const Lmod =
        (leaflet as unknown as { default?: typeof L }).default ??
        (leaflet as unknown as typeof L);
      if (cancelled || !el.current) return;

      // Fully decorative: every interaction off, pointer events killed in CSS.
      const map = Lmod.map(el.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
        zoomSnap: 0.25,
      });

      Lmod.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 20 },
      ).addTo(map);

      ZONES.forEach((z) => {
        Lmod.polygon(z.points, {
          color: "#eab308",
          weight: 2,
          fillColor: "#eab308",
          fillOpacity: 0.09,
          className: "tz-zone",
        }).addTo(map);
        Lmod.marker(z.label, {
          interactive: false,
          icon: Lmod.divIcon({
            className: "",
            iconSize: [0, 0],
            html: `<span class="tz-zone-label">${z.name}</span>`,
          }),
        }).addTo(map);
      });

      // Frame wide: generous padding pulls the view out past the zones so the
      // whole Henday ring is in the picture, not just the two shapes.
      map.fitBounds([...NORTH_ZONE, ...SOUTH_ZONE], {
        padding: [56, 56],
        maxZoom: 10.75,
      });

      mapRef.current = map;
      requestAnimationFrame(() => map.invalidateSize());
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [visible]);

  return (
    <div className={`tz-map relative ${className ?? ""}`}>
      <div ref={el} className="h-full w-full" />
      {/* Vignette: sinks the tile edges into the noir panel so the map reads
          as part of the section, not an embedded widget. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[500] shadow-[inset_0_0_44px_12px_rgba(15,15,15,0.7)]"
      />
      <span className="pointer-events-none absolute bottom-1.5 right-2.5 z-[500] text-[9px] text-white/25">
        © OpenStreetMap · © CARTO
      </span>
    </div>
  );
}
