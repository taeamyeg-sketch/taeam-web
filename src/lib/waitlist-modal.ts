"use client";

/**
 * Open the global waitlist modal from anywhere (home hero button, header CTA,
 * logo hub menu). The modal (mounted once in the layout) listens for this event
 * and handles the email capture + "you're already in" case.
 */
export function openWaitlist() {
  window.dispatchEvent(new CustomEvent("taeam:waitlist"));
}
