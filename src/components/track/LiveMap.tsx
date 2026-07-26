"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker, Polyline } from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/cn";

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  kind: "restaurant" | "home" | "driver";
}

/**
 * Live tracking map on Leaflet + OpenStreetMap (no API key, no billing).
 * Pins are divIcons styled to the brand; the driver pin animates between
 * location updates via CSS transitions on the marker element.
 */
export function LiveMap({
  pins,
  route,
  className,
}: {
  pins: MapPin[];
  route?: [number, number][];
  className?: string;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markers = useRef<Map<string, Marker>>(new Map());
  const routeRef = useRef<Polyline | null>(null);
  const fitKeyRef = useRef("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !holder.current || mapRef.current) return;

      const map = L.map(holder.current, {
        zoomControl: false,
        attributionControl: true,
        // Wheel/one-finger pan would hijack page scroll over the full-width
        // map; pinch-zoom and the corner controls still work.
        scrollWheelZoom: false,
        dragging: !("ontouchstart" in window),
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap, © CARTO",
        maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      map.setView([53.5461, -113.4938], 11); // Edmonton until pins arrive
      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markers.current.clear();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const map = mapRef.current;
      if (!map) return;
      const L = (await import("leaflet")).default;

      const iconFor = (kind: MapPin["kind"]) =>
        L.divIcon({
          className: "",
          iconSize: kind === "driver" ? [22, 22] : [30, 30],
          iconAnchor: kind === "driver" ? [11, 11] : [15, 30],
          html:
            kind === "driver"
              ? `<div style="width:22px;height:22px;border-radius:9999px;background:#121212;border:3px solid #eea742;box-shadow:0 2px 8px rgb(18 18 18/.35);transition:transform .3s"></div>`
              : `<div style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:9999px 9999px 9999px 2px;transform:rotate(-45deg);background:${kind === "restaurant" ? "#eea742" : "#2a9d8f"};box-shadow:0 2px 8px rgb(18 18 18/.3)"><span style="transform:rotate(45deg);display:flex">${
                  kind === "restaurant"
                    ? // storefront glyph
                      `<svg width="14" height="14" viewBox="0 0 256 256" fill="#121212"><path d="M232 96a7.9 7.9 0 0 0-.3-2.2l-14.3-50.2A16.1 16.1 0 0 0 202 32H54a16.1 16.1 0 0 0-15.4 11.6L24.3 93.8A7.9 7.9 0 0 0 24 96v16a40 40 0 0 0 16 32v64a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16v-64a40 40 0 0 0 16-32ZM54 48h148l11.4 40H42.6Zm50 56h48v8a24 24 0 0 1-48 0Zm-16 0v8a24 24 0 0 1-48 0v-8Zm112 104H56v-56.8a40.6 40.6 0 0 0 8 .8 40 40 0 0 0 32-16 40 40 0 0 0 64 0 40 40 0 0 0 32 16 40.6 40.6 0 0 0 8-.8Zm16-72a24 24 0 0 1-24-24v-8h48v8a24 24 0 0 1-24 24Z"/></svg>`
                    : // house glyph
                      `<svg width="14" height="14" viewBox="0 0 256 256" fill="#fff"><path d="M218.8 103.7 138.8 29a16 16 0 0 0-21.6 0l-80 74.7a16 16 0 0 0-5.2 11.8V208a16 16 0 0 0 16 16h48a16 16 0 0 0 16-16v-48h32v48a16 16 0 0 0 16 16h48a16 16 0 0 0 16-16v-92.5a16 16 0 0 0-5.2-11.8ZM208 208h-48v-48a16 16 0 0 0-16-16h-32a16 16 0 0 0-16 16v48H48v-92.5l80-74.7 80 74.7Z"/></svg>`
                }</span></div>`,
        });

      const seen = new Set<string>();
      for (const pin of pins) {
        seen.add(pin.id);
        const existing = markers.current.get(pin.id);
        if (existing) {
          existing.setLatLng([pin.lat, pin.lng]);
        } else {
          const m = L.marker([pin.lat, pin.lng], { icon: iconFor(pin.kind) }).addTo(map);
          markers.current.set(pin.id, m);
        }
      }
      for (const [id, marker] of markers.current) {
        if (!seen.has(id)) {
          marker.remove();
          markers.current.delete(id);
        }
      }

      if (route && route.length > 1 && !routeRef.current) {
        routeRef.current = L.polyline(route, {
          color: "#121212",
          weight: 3,
          opacity: 0.75,
          dashArray: "1 7",
          lineCap: "round",
        }).addTo(map);
      }

      // Fit only when the SET of pins changes (driver appears, order phase
      // shifts) — not on every live location tick, which would keep snapping
      // the camera back while the user pans/zooms.
      const key = [...seen].sort().join("|") + (route ? `#r${route.length}` : "");
      if (key !== fitKeyRef.current) {
        fitKeyRef.current = key;
        const boundsSource: [number, number][] = [
          ...pins.map((p) => [p.lat, p.lng] as [number, number]),
          ...(route ?? []),
        ];
        if (boundsSource.length > 0) {
          map.fitBounds(L.latLngBounds(boundsSource), { padding: [40, 40], maxZoom: 15 });
        }
      }
    })();
  }, [pins, route]);

  return <div ref={holder} className={cn("isolate", className)} />;
}
