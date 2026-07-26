"use client";

import { openWaitlist } from "@/lib/waitlist-modal";

/**
 * A "Join the waitlist" trigger that opens the global modal. Used everywhere
 * except the home hero, which keeps its own inline email field.
 */
export function JoinWaitlistButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={() => openWaitlist()} className={className}>
      {children}
    </button>
  );
}
