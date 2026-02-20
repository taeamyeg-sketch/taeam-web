'use client';

import { useEffect, useRef } from 'react';

type LatLng = [number, number];

// North Edmonton zone — clean Dasher-style polygon, strictly above downtown
// Covers north Edmonton (above ~53.565), clear of central Edmonton
const NORTH_ZONE: LatLng[] = [
  [53.620, -113.665],  // upper-left
  [53.672, -113.600],  // top-left
  [53.681, -113.510],  // top-center
  [53.672, -113.415],  // top-right
  [53.643, -113.348],  // right
  [53.576, -113.352],  // lower-right
  [53.564, -113.455],  // bottom-right
  [53.564, -113.565],  // bottom-left
  [53.576, -113.660],  // lower-left
];

// South Edmonton zone — identical shape template, strictly below downtown
// Covers south Edmonton (below ~53.510), ~168km south of north zone bottom
const SOUTH_ZONE: LatLng[] = [
  [53.452, -113.665],  // upper-left
  [53.504, -113.600],  // top-left
  [53.513, -113.510],  // top-center
  [53.504, -113.415],  // top-right
  [53.475, -113.348],  // right
  [53.408, -113.352],  // lower-right
  [53.396, -113.455],  // bottom-right
  [53.396, -113.565],  // bottom-left
  [53.408, -113.660],  // lower-left
];

export default function EdmontonMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if ((mapRef.current as HTMLDivElement & { _leaflet_id?: number })._leaflet_id) return;

    // Inject custom CSS for map animations
    if (!document.getElementById('edmonton-map-styles')) {
      const style = document.createElement('style');
      style.id = 'edmonton-map-styles';
      style.textContent = `
        @keyframes zone-glow {
          0%, 100% { 
            filter: drop-shadow(0 0 12px rgba(234, 179, 8, 0.5)) drop-shadow(0 0 24px rgba(234, 179, 8, 0.2));
          }
          50% { 
            filter: drop-shadow(0 0 20px rgba(234, 179, 8, 0.7)) drop-shadow(0 0 40px rgba(234, 179, 8, 0.3));
          }
        }
        @keyframes zone-fill-pulse {
          0%, 100% { fill-opacity: 0.12; }
          50% { fill-opacity: 0.22; }
        }
        .edmonton-zone {
          animation: zone-glow 4s ease-in-out infinite, zone-fill-pulse 4s ease-in-out infinite;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .edmonton-zone:hover {
          fill-opacity: 0.3 !important;
          filter: drop-shadow(0 0 30px rgba(234, 179, 8, 0.8)) drop-shadow(0 0 60px rgba(234, 179, 8, 0.4)) !important;
        }
        .zone-label {
          background: linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(0, 0, 0, 0.8) 100%);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(234, 179, 8, 0.3);
          padding: 6px 14px;
          border-radius: 20px;
          color: #EAB308;
          font-weight: 800;
          font-size: 10px;
          letter-spacing: 2.5px;
          white-space: nowrap;
          text-shadow: 0 2px 8px rgba(0,0,0,0.9);
          font-family: system-ui, -apple-system, sans-serif;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(234, 179, 8, 0.15);
          transition: all 0.3s ease;
        }
        .zone-label:hover {
          background: linear-gradient(135deg, rgba(234, 179, 8, 0.25) 0%, rgba(0, 0, 0, 0.9) 100%);
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.6), 0 0 30px rgba(234, 179, 8, 0.25);
          transform: scale(1.05);
        }
      `;
      document.head.appendChild(style);
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css'; link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    let map: import('leaflet').Map | null = null;

    import('leaflet').then((L) => {
      if (!mapRef.current) return;
      if ((mapRef.current as HTMLDivElement & { _leaflet_id?: number })._leaflet_id) return;

      map = L.map(mapRef.current, {
        center: [53.535, -113.494], zoom: 10,
        zoomControl: false, attributionControl: false,
        scrollWheelZoom: false, dragging: false,
        doubleClickZoom: false, touchZoom: false,
        keyboard: false, boxZoom: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 20,
      }).addTo(map);

      // Premium holographic zone styling
      const zoneStyle = {
        color: '#EAB308',
        weight: 2.5,
        opacity: 1,
        fillColor: '#EAB308',
        fillOpacity: 0.18,
        className: 'edmonton-zone',
        smoothFactor: 0,
      };

      // Create both zones with identical styling
      const northPoly = L.polygon(NORTH_ZONE, { ...zoneStyle }).addTo(map);
      const southPoly = L.polygon(SOUTH_ZONE, { ...zoneStyle }).addTo(map);

      // Stagger the animation for visual interest
      setTimeout(() => {
        const southEl = southPoly.getElement() as HTMLElement | null;
        if (southEl) southEl.style.animationDelay = '2s';
      }, 100);

      // Premium label styling
      const createLabel = (text: string) => `<div class="zone-label">${text}</div>`;
      
      L.marker([53.622, -113.508], { 
        icon: L.divIcon({ 
          html: createLabel('NORTH EDMONTON'), 
          className: '', 
          iconAnchor: [72, 12] 
        }), 
        interactive: false 
      }).addTo(map);
      
      L.marker([53.454, -113.508], { 
        icon: L.divIcon({ 
          html: createLabel('SOUTH EDMONTON'), 
          className: '', 
          iconAnchor: [72, 12] 
        }), 
        interactive: false 
      }).addTo(map);

      cleanupRef.current = () => { map?.remove(); map = null; };
    });

    return () => { cleanupRef.current?.(); cleanupRef.current = null; };
  }, []);

  return (
    <div className="relative w-full aspect-[4/5] max-w-md mx-auto select-none group">
      {/* Ambient glow layers */}
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#EAB308]/10 via-transparent to-[#EAB308]/5 blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none" />
      <div className="absolute inset-0 rounded-3xl bg-[#EAB308]/5 blur-xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      
      {/* Main map container */}
      <div className="relative w-full h-full rounded-3xl overflow-hidden border border-[#EAB308]/20 shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_60px_rgba(234,179,8,0.08)] bg-[#0a0a0a] group-hover:border-[#EAB308]/40 transition-all duration-500">
        {/* Inner glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#EAB308]/5 via-transparent to-[#EAB308]/3 pointer-events-none z-10" />
        
        {/* Map */}
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Top fade for polish */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0a0a0a]/80 to-transparent pointer-events-none z-10" />
        
        {/* Legend badge */}
        <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center z-[1000] pointer-events-none">
          <div className="flex items-center gap-2.5 bg-black/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#EAB308]/30 shadow-[0_4px_20px_rgba(0,0,0,0.4),0_0_15px_rgba(234,179,8,0.1)]">
            <div className="relative">
              <div className="w-3 h-3 rounded-sm bg-[#EAB308]" />
              <div className="absolute inset-0 w-3 h-3 rounded-sm bg-[#EAB308] animate-ping opacity-40" />
            </div>
            <span className="text-[#EAB308] text-[10px] font-bold tracking-[0.15em] uppercase">Soft Launch Zones</span>
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-[#EAB308]/30 rounded-tl-lg pointer-events-none z-10" />
        <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-[#EAB308]/30 rounded-tr-lg pointer-events-none z-10" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-[#EAB308]/30 rounded-bl-lg pointer-events-none z-10" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-[#EAB308]/30 rounded-br-lg pointer-events-none z-10" />
      </div>
    </div>
  );
}
