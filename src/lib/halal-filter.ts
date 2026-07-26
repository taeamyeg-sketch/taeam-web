import type { Restaurant } from "./types";

/**
 * The halal-transparency filter — Taeam's whole "taste the trust" promise,
 * mirrored from the app's home filter sheet. Slaughter method, an optional
 * stunning refinement, and a Taeam-Verified-only switch.
 */
export interface HalalFilter {
  slaughter: string | null; // hand_slaughtered | machine_slaughtered | mixed
  stunning: string | null; // non_stunned | stunned_reversible | stunned
  verifiedOnly: boolean;
}

export const EMPTY_HALAL_FILTER: HalalFilter = {
  slaughter: null,
  stunning: null,
  verifiedOnly: false,
};

export function hasHalalFilter(f: HalalFilter): boolean {
  return f.slaughter != null || f.stunning != null || f.verifiedOnly;
}

export function halalFilterCount(f: HalalFilter): number {
  return (
    (f.slaughter ? 1 : 0) + (f.stunning ? 1 : 0) + (f.verifiedOnly ? 1 : 0)
  );
}

export function applyHalalFilter(
  list: Restaurant[],
  f: HalalFilter,
): Restaurant[] {
  let out = list;
  if (f.slaughter) out = out.filter((r) => r.slaughter_type === f.slaughter);
  if (f.stunning) out = out.filter((r) => r.stunning_method === f.stunning);
  if (f.verifiedOnly)
    out = out.filter((r) => r.verification_status === "taeam_verified");
  return out;
}
