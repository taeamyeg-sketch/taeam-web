import type { CSSProperties } from "react";

/**
 * The waitlist confirmation mark. Drawn here rather than taken from the icon
 * set so the tick can stroke in. It only moves inside `.wl-joined` (see
 * globals.css); anywhere else it is a plain filled check.
 */
export function WaitlistCheck({
  className,
  tickClassName,
  style,
}: {
  className?: string;
  tickClassName?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 256 256" className={className} style={style} aria-hidden>
      <circle className="wl-disc" cx="128" cy="128" r="104" fill="currentColor" />
      <path
        className={`wl-tick ${tickClassName ?? ""}`}
        d="M84 132l30 30 58-58"
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
