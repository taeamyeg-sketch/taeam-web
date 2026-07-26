import type { ReactNode } from "react";

/**
 * The small uppercase gold kicker that sits above nearly every section heading.
 * It was previously re-declared inline in ~15 places with drifting weight
 * (bold/semibold/black), letter-spacing (0.1–0.22em) and colour — this is the
 * one canonical treatment so the site reads as a single system.
 *
 * `tone="bright"` is for the vivid gold used on the dark (noir) islands, where
 * gold-deep would look muddy; default `tone="deep"` is the AA-safe gold on cream.
 */
export function Eyebrow({
  children,
  tone = "deep",
  className = "",
}: {
  children: ReactNode;
  tone?: "deep" | "bright";
  className?: string;
}) {
  const color = tone === "bright" ? "text-gold-bright" : "text-gold-deep";
  return (
    <p
      className={`text-xs font-bold uppercase tracking-[0.2em] ${color} ${className}`}
    >
      {children}
    </p>
  );
}
