import { cn } from "@/lib/cn";

/**
 * The verification mark: a check inside a ring.
 *
 * This replaces the old khatam (eight-pointed star), which was doing two
 * unrelated jobs at once — standing in for "Taeam Verified" and acting as a
 * decorative flourish — and was not legible as either. An abstract star never
 * told anyone a kitchen had been checked; a check does, and it survives being
 * shrunk to the 12px badge size.
 *
 * Use it ONLY where something has actually been verified or affirmed. For
 * decoration, use <Rule>.
 */
export function Seal({
  className,
  strokeWidth = 1.6,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M7.6 12.3 L10.6 15.3 L16.4 9"
        stroke="currentColor"
        strokeWidth={strokeWidth * 1.15}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The decorative accent: a short gold rule.
 *
 * Everywhere the khatam was pure ornament (footer, error pages, section
 * intros), a rule carries the same weight without pretending to be a symbol.
 * Width comes from the caller so it can sit inline in a text row or stand
 * alone above a heading.
 */
export function Rule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block h-px w-6 shrink-0 bg-current", className)}
    />
  );
}

/** A hairline section divider, broken by a short gold segment at its centre. */
export function Divider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-4", className)}>
      <span className="h-px flex-1 bg-cream-line" />
      <span className="h-px w-10 bg-gold" />
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
