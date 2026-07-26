import { cn } from "@/lib/cn";

/**
 * Khatam (eight-pointed star) drawn as two overlapping squares — the one
 * geometric motif the site is allowed. Used small, in outline, sparingly.
 */
export function Khatam({
  className,
  strokeWidth = 1.2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect
        x="5.2"
        y="5.2"
        width="13.6"
        height="13.6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <rect
        x="5.2"
        y="5.2"
        width="13.6"
        height="13.6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        transform="rotate(45 12 12)"
      />
    </svg>
  );
}

/** A hairline section divider with a single khatam at its centre. */
export function Divider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("flex items-center gap-4 text-gold", className)}
    >
      <span className="h-px flex-1 bg-cream-line" />
      <Khatam className="h-4 w-4 opacity-70" />
      <span className="h-px flex-1 bg-cream-line" />
    </div>
  );
}

/**
 * Seam between the dark brand islands and the light ordering surfaces. A short
 * gradient that fades one register into the next so the boundary is deliberate,
 * never an abrupt cut. `to` is the register the NEXT section is in.
 */
export function Seam({ to }: { to: "noir" | "cream" }) {
  return (
    <div
      aria-hidden
      className={cn("seam", to === "noir" ? "seam-to-noir" : "seam-to-cream")}
    />
  );
}
