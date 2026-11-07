'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Use a thousands separator (e.g. 1,775,715). Default true. */
  separator?: boolean;
  className?: string;
}

function format(value: number, decimals: number, separator: boolean) {
  const fixed = value.toFixed(decimals);
  if (!separator) return fixed;
  const [intPart, decPart] = fixed.split('.');
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decPart ? `${withCommas}.${decPart}` : withCommas;
}

/**
 * Animated number that counts from 0 to `to` the first time it scrolls
 * into view. easeOutCubic for a punchy-then-settle feel.
 *
 * The real number is the initial state, so the static HTML, crawlers and
 * no-JS visitors all get it, never a 0. The count starts the moment the first
 * pixel enters the viewport (no margin), so the swap to 0 is never seen.
 * Real quantities only: a year counted up from 0 is nonsense.
 */
export default function CountUp({
  to,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = true,
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let startTime: number | undefined;

    const tick = (now: number) => {
      if (startTime === undefined) startTime = now;
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(to * eased);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setValue(to);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {format(value, decimals, separator)}
      {suffix}
    </span>
  );
}
