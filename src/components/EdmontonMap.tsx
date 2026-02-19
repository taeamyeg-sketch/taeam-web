'use client';

export default function EdmontonMap() {
  return (
    <div className="relative w-full aspect-[4/5] max-w-sm mx-auto select-none">
      {/* Outer glow container */}
      <div className="absolute inset-0 rounded-3xl bg-[#EAB308]/5 blur-xl" />

      <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-2xl">

        {/* Grid lines — map feel */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#EAB308" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Main SVG map of Edmonton zones */}
        <svg
          viewBox="0 0 300 380"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ── NORTH EDMONTON ZONE ── */}
          <g>
            {/* Glow layer */}
            <path
              d="M 50 40 L 250 40 L 260 80 L 255 130 L 245 155 L 155 162 L 145 162 L 55 155 L 45 130 L 40 80 Z"
              fill="#EAB308"
              opacity="0.08"
              filter="url(#glow)"
            />
            {/* Fill */}
            <path
              d="M 50 40 L 250 40 L 260 80 L 255 130 L 245 155 L 155 162 L 145 162 L 55 155 L 45 130 L 40 80 Z"
              fill="#EAB308"
              opacity="0.18"
              className="animate-breathe"
            />
            {/* Border */}
            <path
              d="M 50 40 L 250 40 L 260 80 L 255 130 L 245 155 L 155 162 L 145 162 L 55 155 L 45 130 L 40 80 Z"
              fill="none"
              stroke="#EAB308"
              strokeWidth="1.5"
              opacity="0.6"
              strokeLinejoin="round"
            />
            {/* Street lines */}
            <line x1="80" y1="40" x2="80" y2="155" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />
            <line x1="120" y1="40" x2="118" y2="160" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />
            <line x1="160" y1="40" x2="160" y2="162" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />
            <line x1="200" y1="40" x2="202" y2="158" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />
            <line x1="40" y1="75" x2="260" y2="75" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />
            <line x1="42" y1="110" x2="258" y2="110" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />
            <line x1="46" y1="140" x2="254" y2="140" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />

            {/* Label */}
            <text x="150" y="108" textAnchor="middle" fill="#EAB308" fontSize="11" fontWeight="700" letterSpacing="2" fontFamily="sans-serif" opacity="0.9">
              NORTH
            </text>
            <text x="150" y="123" textAnchor="middle" fill="#EAB308" fontSize="9" fontWeight="500" letterSpacing="1" fontFamily="sans-serif" opacity="0.6">
              EDMONTON
            </text>

            {/* Pulse dot */}
            <circle cx="150" cy="88" r="4" fill="#EAB308" opacity="0.9">
              <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0;0.9" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="150" cy="88" r="3" fill="#EAB308" opacity="1" />
          </g>

          {/* ── RIVER VALLEY DIVIDER ── */}
          <g opacity="0.5">
            {/* North Saskatchewan River */}
            <path
              d="M 30 172 Q 80 165 130 170 Q 160 172 180 168 Q 220 163 270 170"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.4"
            />
            <path
              d="M 30 178 Q 80 171 130 176 Q 160 178 180 174 Q 220 169 270 176"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.2"
            />
            {/* River label */}
            <text x="150" y="187" textAnchor="middle" fill="#3B82F6" fontSize="7" fontWeight="500" letterSpacing="1" fontFamily="sans-serif" opacity="0.5">
              NORTH SASKATCHEWAN RIVER
            </text>
          </g>

          {/* ── SOUTH EDMONTON ZONE ── */}
          <g>
            {/* Glow layer */}
            <path
              d="M 55 198 L 245 198 L 250 230 L 252 270 L 245 310 L 230 340 L 150 345 L 70 340 L 55 310 L 48 270 L 50 230 Z"
              fill="#EAB308"
              opacity="0.08"
              filter="url(#glow)"
            />
            {/* Fill */}
            <path
              d="M 55 198 L 245 198 L 250 230 L 252 270 L 245 310 L 230 340 L 150 345 L 70 340 L 55 310 L 48 270 L 50 230 Z"
              fill="#EAB308"
              opacity="0.18"
              className="animate-breathe"
              style={{ animationDelay: '1s' }}
            />
            {/* Border */}
            <path
              d="M 55 198 L 245 198 L 250 230 L 252 270 L 245 310 L 230 340 L 150 345 L 70 340 L 55 310 L 48 270 L 50 230 Z"
              fill="none"
              stroke="#EAB308"
              strokeWidth="1.5"
              opacity="0.6"
              strokeLinejoin="round"
            />
            {/* Street lines */}
            <line x1="80" y1="198" x2="78" y2="338" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />
            <line x1="120" y1="198" x2="119" y2="343" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />
            <line x1="160" y1="198" x2="160" y2="345" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />
            <line x1="200" y1="198" x2="201" y2="342" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />
            <line x1="50" y1="225" x2="250" y2="225" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />
            <line x1="49" y1="258" x2="251" y2="258" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />
            <line x1="50" y1="290" x2="250" y2="290" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />
            <line x1="54" y1="320" x2="246" y2="320" stroke="#EAB308" strokeWidth="0.4" opacity="0.25" />

            {/* Label */}
            <text x="150" y="268" textAnchor="middle" fill="#EAB308" fontSize="11" fontWeight="700" letterSpacing="2" fontFamily="sans-serif" opacity="0.9">
              SOUTH
            </text>
            <text x="150" y="283" textAnchor="middle" fill="#EAB308" fontSize="9" fontWeight="500" letterSpacing="1" fontFamily="sans-serif" opacity="0.6">
              EDMONTON
            </text>

            {/* Pulse dot */}
            <circle cx="150" cy="245" r="4" fill="#EAB308" opacity="0.9">
              <animate attributeName="r" values="4;8;4" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0;0.9" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="150" cy="245" r="3" fill="#EAB308" opacity="1" />
          </g>

          {/* ── TAEAM MAP PIN — North ── */}
          <g transform="translate(100, 60)">
            <circle cx="0" cy="0" r="9" fill="#1a1a1a" stroke="#EAB308" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fontSize="10" fill="#EAB308">🍽</text>
          </g>
          <g transform="translate(190, 130)">
            <circle cx="0" cy="0" r="9" fill="#1a1a1a" stroke="#EAB308" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fontSize="10" fill="#EAB308">🍽</text>
          </g>

          {/* ── TAEAM MAP PIN — South ── */}
          <g transform="translate(110, 220)">
            <circle cx="0" cy="0" r="9" fill="#1a1a1a" stroke="#EAB308" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fontSize="10" fill="#EAB308">🍽</text>
          </g>
          <g transform="translate(185, 305)">
            <circle cx="0" cy="0" r="9" fill="#1a1a1a" stroke="#EAB308" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fontSize="10" fill="#EAB308">🍽</text>
          </g>

          {/* Glow filter */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#EAB308] opacity-70" />
            <span className="text-[#EAB308] text-[10px] font-bold tracking-wider uppercase opacity-80">Soft Launch Zone</span>
          </div>
        </div>

        {/* Compass rose */}
        <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#EAB308] text-[8px] font-black opacity-60 -translate-y-[7px] block">N</span>
            </div>
            <svg viewBox="0 0 24 24" className="w-6 h-6 opacity-30">
              <path d="M12 2 L14 10 L12 8 L10 10 Z" fill="#EAB308" />
              <path d="M12 22 L10 14 L12 16 L14 14 Z" fill="#ffffff" opacity="0.5" />
              <circle cx="12" cy="12" r="2" fill="#EAB308" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
