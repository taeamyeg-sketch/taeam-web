"use client";

import { supabase } from "@/lib/supabase";
import { BACKEND_URL } from "@/lib/backend";
import { trackWaitlistLead } from "@/lib/meta-pixel";

export type WaitlistResult =
  | { status: "new"; emailed: boolean }
  | { status: "existing"; emailed: false }
  | { status: "fail" };

const JOINED_KEY = "taeam.waitlist.joined";

/** True if this device already joined the waitlist (localStorage flag). */
export function alreadyJoined(): boolean {
  try {
    return !!localStorage.getItem(JOINED_KEY);
  } catch {
    return false;
  }
}

/**
 * Shared waitlist signup, used by both the home hero (inline field) and the
 * global modal so they behave identically. Stores the email in public.waitlist
 * (bonus_points defaults to the fixed launch bonus, pinned by RLS); the unique
 * lower(email) index turns a repeat into 23505 = "already in". Sends the branded
 * confirmation email for a genuinely new signup only, and remembers the device
 * so a return visit is greeted as already-in.
 *
 * This is the single place the Meta pixel's Lead event fires, for both entry
 * points (home hero field and global modal) — after the insert resolves, and
 * only for a new row. A bad email never reaches here (both callers validate
 * first), and a duplicate lands on 23505 = "existing", which does not convert.
 */
export async function submitWaitlist(rawEmail: string): Promise<WaitlistResult> {
  const email = rawEmail.trim().toLowerCase();

  let status: "new" | "existing" = "new";
  try {
    const { error } = await supabase.from("waitlist").insert([{ email }]);
    if (error) {
      if (error.code === "23505") status = "existing";
      else {
        console.error("waitlist insert failed:", error);
        return { status: "fail" };
      }
    }
  } catch (err) {
    console.error("waitlist insert threw:", err);
    return { status: "fail" };
  }

  // Row is in. Count the conversion before the (slower, failure-tolerant)
  // confirmation-email call, so a flaky backend can't cost us a Lead.
  if (status === "new") trackWaitlistLead();

  let emailed = false;
  if (status === "new") {
    try {
      const res = await fetch(`${BACKEND_URL}/api/waitlist/launch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      emailed = !!data.emailed;
    } catch (err) {
      console.error("waitlist email request failed:", err);
    }
  }

  try {
    localStorage.setItem(JOINED_KEY, email);
  } catch {
    /* private mode — fine */
  }

  return status === "new" ? { status: "new", emailed } : { status: "existing", emailed: false };
}
