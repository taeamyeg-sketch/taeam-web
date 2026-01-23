'use client';

import React from 'react';

// Brand Colors
const BRAND = {
  GOLD: '#EAB308',
  BLACK: '#0f0f0f',
} as const;

type SectionVariant = 'hero' | 'features' | 'footer';

interface SplitSectionProps {
  children: React.ReactNode;
  variant: SectionVariant;
  className?: string;
}

const VARIANTS = {
  hero: {
    baseColor: BRAND.GOLD,
    overlayColor: BRAND.BLACK,
    clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
    textOnBase: BRAND.BLACK,
    textOnOverlay: BRAND.GOLD,
  },
  features: {
    baseColor: BRAND.BLACK,
    overlayColor: BRAND.GOLD,
    clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
    textOnBase: BRAND.GOLD,
    textOnOverlay: BRAND.BLACK,
  },
  footer: {
    baseColor: BRAND.GOLD,
    overlayColor: BRAND.BLACK,
    clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
    textOnBase: BRAND.BLACK,
    textOnOverlay: BRAND.GOLD,
  },
} as const;

export default function SplitSection({
  children,
  variant,
  className = '',
}: SplitSectionProps) {
  const config = VARIANTS[variant];

  return (
    <section
      className={`relative w-full ${className}`}
      style={{ backgroundColor: config.baseColor }}
    >
      {/* Diagonal Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundColor: config.overlayColor,
          clipPath: config.clipPath,
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}

// Export config for use with AdaptiveText
export function getSplitConfig(variant: SectionVariant) {
  return VARIANTS[variant];
}

export { BRAND, VARIANTS };
