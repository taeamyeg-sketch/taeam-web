'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Camera } from 'lucide-react';

/**
 * Editorial figure with optional scroll parallax and a graceful placeholder.
 * Width / height is controlled by the parent via `sizeClass` (an aspect-* class
 * or a height class), so the same component can be a full-bleed banner, a
 * column-width inset, or a side-by-side panel.
 */
export default function Figure({
  src,
  alt,
  caption,
  sizeClass = 'aspect-[3/2]',
  parallax = true,
  rounded = true,
  className = '',
}: {
  src: string;
  alt: string;
  caption?: string;
  sizeClass?: string;
  parallax?: boolean;
  rounded?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasImg, setHasImg] = useState(true);
  const prefersReduced = useReducedMotion();
  const still = !parallax || prefersReduced;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], still ? ['0%', '0%'] : ['-8%', '8%']);

  return (
    <figure className={className}>
      <div ref={ref} className={`relative w-full overflow-hidden ${sizeClass} ${rounded ? 'rounded-2xl' : ''}`}>
        {hasImg ? (
          <motion.img
            src={src}
            alt={alt}
            style={{ y }}
            loading="lazy"
            decoding="async"
            onError={() => setHasImg(false)}
            className={
              still
                ? 'absolute inset-0 h-full w-full object-cover'
                : 'absolute inset-0 -top-[8%] h-[116%] w-full object-cover'
            }
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#efe7d6_0%,#e2d4bd_100%)]">
            <div className="flex flex-col items-center gap-2 text-[#ab9c80]">
              <Camera className="h-5 w-5" strokeWidth={1.5} />
              <span className="font-mono text-[11px] tracking-tight">{src}</span>
            </div>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm italic leading-snug text-[#8a8178]">{caption}</figcaption>
      )}
    </figure>
  );
}
