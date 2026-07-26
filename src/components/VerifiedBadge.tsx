import { cn } from "@/lib/cn";
import type { Restaurant } from "@/lib/types";
import { Khatam } from "./Pattern";

export function verificationLabel(status: string | null): string | null {
  switch (status) {
    case "taeam_verified":
      return "Taeam Verified";
    case "owner_declaration":
      return "Owner-declared halal";
    default:
      return null;
  }
}

export function slaughterLabel(r: Restaurant): string | null {
  const parts: string[] = [];
  if (r.slaughter_type === "hand_slaughtered") parts.push("Hand slaughtered");
  if (r.slaughter_type === "machine_slaughtered") parts.push("Machine slaughtered");
  if (r.stunning_method === "non_stunned") parts.push("non-stunned");
  if (r.stunning_method === "stunned") parts.push("stunned");
  return parts.length ? parts.join(", ") : null;
}

/**
 * The halal-transparency badge — the thing the big platforms can't show.
 * Gold khatam for restaurants Taeam verified ourselves; quiet outline for
 * owner declarations.
 */
export function VerifiedBadge({
  status,
  className,
}: {
  status: string | null;
  className?: string;
}) {
  const label = verificationLabel(status);
  if (!label) return null;
  const verified = status === "taeam_verified";
  return (
    <span
      title={
        verified
          ? "Halal sourcing reviewed and verified by the Taeam team"
          : "The owner has declared this kitchen halal; Taeam verification pending"
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        verified
          ? "bg-gold/15 text-gold-deep"
          : "border border-cream-line bg-cream text-ink-mute",
        className,
      )}
    >
      <Khatam className="h-3 w-3" strokeWidth={1.8} />
      {label}
    </span>
  );
}
