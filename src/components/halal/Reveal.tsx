import React from 'react';

interface RevealProps {
  children: React.ReactNode;
  /** Kept for API compatibility; content renders immediately, no animation. */
  delay?: number;
  /** Kept for API compatibility; content renders immediately, no animation. */
  y?: number;
  className?: string;
}

/**
 * Plain block wrapper. It used to fade and slide its children in on scroll;
 * content now simply renders in place.
 */
export default function Reveal({ children, className = '' }: RevealProps) {
  return <div className={className || undefined}>{children}</div>;
}
