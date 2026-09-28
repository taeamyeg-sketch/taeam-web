"use client";

import { supabase } from "@/lib/supabase";
import { BACKEND_URL } from "@/lib/backend";
import { trackDriverSignup } from "@/lib/meta-pixel";

export type DriverWaitlistResult =
  | { status: "new"; emailed: boolean }
  | { status: "existing"; emailed: false }
  | { status: "fail" };

const JOINED_KEY = "taeam.driver.joined";

/**
 * True if this device already joined the driver waitlist (localStorage flag). The
 * flag is "1". Builds before 2026-09-28 stored the email address itself, which
 * nothing ever read back, so an old value is overwritten here the first time
 * it is seen.
 */
export function alreadyJoinedDriver(): boolean {
  try {
    const v = localStorage.getItem(JOINED_KEY);
    if (v && v !== "1") localStorage.setItem(JOINED_KEY, "1");
    return !!v;
  } catch {
    return false;
  }
}

/**
 * Shared driver-waitlist signup, mirroring submitWaitlist so the driver page
 * behaves identically to the launch waitlist. Stores the email in
 * public.driver_signups; the unique lower(email) index turns a repeat into
 * 23505 = "already in". Sends the branded confirmation email for a genuinely
 * new signup only (never re-emails a duplicate), and remembers the device so a
 * return visit is greeted as already-in.
 *
 * Fires the pixel's custom `DriverSignup` event — NOT the `Lead` the customer
 * waitlist uses. Two funnels, two events, so driver-recruitment ads never
 * optimize against customer signups or vice versa.
 */
export async function submitDriverWaitlist(rawEmail: string): Promise<DriverWaitlistResult> {
  const email = rawEmail.trim().toLowerCase();

  let status: "new" | "existing" = "new";
  try {
    const { error } = await supabase.from("driver_signups").insert([{ email }]);
    if (error) {
      if (error.code === "23505") status = "existing";
      else {
        console.error("driver_signups insert failed:", error);
        return { status: "fail" };
      }
    }
  } catch (err) {
    console.error("driver_signups insert threw:", err);
    return { status: "fail" };
  }

  // Row is in. Count the conversion before the (slower, failure-tolerant)
  // confirmation-email call, so a flaky backend can't cost us a signup event.
  if (status === "new") trackDriverSignup();

  let emailed = false;
  if (status === "new") {
    try {
      const res = await fetch(`${BACKEND_URL}/api/waitlist/driver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      emailed = !!data.emailed;
    } catch (err) {
      console.error("driver waitlist email request failed:", err);
    }
  }

  try {
    localStorage.setItem(JOINED_KEY, "1"); // a flag, never the email
  } catch {
    /* private mode — fine */
  }

  return status === "new" ? { status: "new", emailed } : { status: "existing", emailed: false };
}
