"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapTrifold, CaretDown } from "@phosphor-icons/react";
import { mosquesNear } from "@/lib/mosques";
import { cn } from "@/lib/cn";

const EDM_LAT = 53.5461;
const EDM_LNG = -113.4938;

export interface MapKitchen {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

function ensurePinStyles() {
  if (document.getElementById("tk-map-styles")) return;
  const s = document.createElement("style");
  s.id = "tk-map-styles";
  s.textContent = `
    .tk-pin{width:18px;height:18px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.4);}
    .tk-kitchen{background:#eea742;}
    .tk-mosque{background:#2a9d8f;}
    .tk-user span{display:block;width:16px;height:16px;border-radius:50%;background:#121212;border:2px solid #fff;box-shadow:0 0 0 5px rgba(18,18,18,.15);}
    .leaflet-popup-content{font-family:var(--font-sans),system-ui,sans-serif;margin:10px 12px;}
    .tk-popup-link{font-weight:800;text-transform:uppercase;font-size:12px;letter-spacing:-0.01em;color:#121212;text-decoration:none;}
    .tk-popup-mosque{font-weight:700;font-size:12px;color:#2a9d8f;}
  `;
  document.head.appendChild(s);
}

/**
 * Collapsible "kitchens near you" map. Stays a slim bar until opened, then lazily
 * spins up Leaflet, plots the halal kitchens (gold) and — pulled live from
 * OpenStreetMap so nothing is hardcoded — nearby mosques (teal). Fails soft: if
 * the mosque lookup is down, the kitchens still show.
 */
export function KitchensMap({
  kitchens,
  centerLat,
  centerLng,
  embedded = false,
  className,
}: {
  kitchens: MapKitchen[];
  centerLat?: number;
  centerLng?: number;
  /** Render the map itself, always open — for the pickup split view. */
  embedded?: boolean;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);
  // Embedded never collapses; the collapsible bar drives itself.
  const open = embedded || expanded;
  const mosques = useMemo(
    () => mosquesNear(centerLat ?? EDM_LAT, centerLng ?? EDM_LNG, 12),
    [centerLat, centerLng],
  );

  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Spin up / tear down Leaflet with the panel.
  useEffect(() => {
    if (!open || !el.current) return;
    let cancelled = false;
    ensurePinStyles();

    import("leaflet").then((leaflet) => {
      const Lmod = (leaflet as unknown as { default?: typeof L }).default ?? (leaflet as unknown as typeof L);
      if (cancelled || !el.current) return;
      LRef.current = Lmod;
      const map = Lmod.map(el.current, {
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: false,
        // One-finger drag would hijack page scrolling on phones; pinch-zoom
        // and the +/- controls still navigate the map there.
        dragging: !("ontouchstart" in window),
        tapHold: false,
      }).setView([centerLat ?? EDM_LAT, centerLng ?? EDM_LNG], 12);
      Lmod.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 20 },
      ).addTo(map);
      mapRef.current = map;
      layerRef.current = Lmod.layerGroup().addTo(map);
      setReady(true);
      // The embedded/sticky container can settle a frame after mount; without
      // this Leaflet measures a stale box and tiles render into dead space.
      requestAnimationFrame(() => map.invalidateSize());
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
      setReady(false);
    };
  }, [open, centerLat, centerLng]);

  // (Re)draw markers whenever the map is ready or the data changes.
  useEffect(() => {
    const Lmod = LRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!ready || !Lmod || !map || !layer) return;
    layer.clearLayers();

    const pin = (cls: string) =>
      Lmod.divIcon({
        className: "",
        html: `<div class="tk-pin ${cls}"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

    const bounds: [number, number][] = [];

    if (centerLat != null && centerLng != null) {
      Lmod.marker([centerLat, centerLng], {
        icon: Lmod.divIcon({
          className: "tk-user",
          html: "<span></span>",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
      }).addTo(layer);
      bounds.push([centerLat, centerLng]);
    }

    kitchens.forEach((k) => {
      Lmod.marker([k.lat, k.lng], { icon: pin("tk-kitchen") })
        .addTo(layer)
        .bindPopup(
          `<a class="tk-popup-link" href="/restaurant/${k.id}">${k.name} →</a>`,
        );
      bounds.push([k.lat, k.lng]);
    });

    mosques.forEach((m) => {
      Lmod.marker([m.lat, m.lng], { icon: pin("tk-mosque") })
        .addTo(layer)
        .bindPopup(`<span class="tk-popup-mosque">${m.name}</span>`);
    });

    if (bounds.length > 1) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    else if (bounds.length === 1) map.setView(bounds[0], 13);
  }, [ready, kitchens, mosques, centerLat, centerLng]);

  const legend = (
    <>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full border-2 border-white bg-gold shadow-sm" />
        Kitchens
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full border-2 border-white bg-green shadow-sm" />
        Mosques
      </span>
    </>
  );

  // Pickup split view: the map itself, filling whatever box it's handed.
  if (embedded) {
    return (
      <div
        className={cn(
          // `isolate` keeps Leaflet's z-1000 controls inside this box instead
          // of painting over the fixed header, sheets, and cart bar.
          "relative isolate overflow-hidden rounded-2xl border border-cream-line bg-cream-deep",
          className,
        )}
      >
        <div ref={el} className="h-full w-full" />
        {/* z-[500] sits above Leaflet's tile/overlay panes but below its markers
            and popups, so a pin never disappears behind the legend. */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex items-center gap-3 rounded-full bg-cream/95 px-3 py-1.5 text-[11px] font-semibold text-ink-mute shadow-card">
          {legend}
        </div>
      </div>
    );
  }

  return (
    <div className="isolate mt-6 overflow-hidden rounded-2xl border border-cream-line bg-cream-deep">
      <button
        onClick={() => setExpanded((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
          <MapTrifold weight="fill" className="h-4 w-4" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-black uppercase tracking-tight text-ink">
            Map · kitchens near you
          </span>
          <span className="block text-xs text-ink-mute">
            {kitchens.length} kitchen{kitchens.length === 1 ? "" : "s"} and mosques around you
          </span>
        </span>
        <span className="text-sm font-bold text-gold-deep">
          {open ? "Hide map" : "View map"}
        </span>
        <CaretDown
          className={cn(
            "h-4 w-4 shrink-0 text-ink-mute transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div>
          <div ref={el} className="h-72 w-full sm:h-80" />
          <div className="flex items-center gap-4 border-t border-cream-line px-4 py-2.5 text-xs font-semibold text-ink-mute">
            {legend}
          </div>
        </div>
      )}
    </div>
  );
}
