import type { Metadata } from "next";
import { LegalMail, LegalSection, LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Taeam's accessibility commitment and how to reach us if something's in your way.",
  robots: { index: true, follow: true },
};

export default function AccessibilityPage() {
  return (
    <LegalShell
      current="/accessibility"
      title="Accessibility"
      updated="September 28, 2026"
      intro={
        <>
          Ordering food shouldn&apos;t depend on how you see, hear, or move.
          We build taeam.ca and the Taeam apps to be usable by everyone, and
          when something falls short we want to hear about it directly.
        </>
      }
    >
      <LegalSection id="standard" title="What we build to">
        <p>
          We work toward the Web Content Accessibility Guidelines (WCAG) 2.1,
          Level AA. In practice, on this site that means:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            The brand gold and red are darkened wherever they carry text on
            light backgrounds, so that text meets the contrast target.
          </li>
          <li>
            Links, buttons and form fields work with a keyboard and show a
            visible focus ring, in a colour that stands out on both our light
            and dark backgrounds.
          </li>
          <li>
            A &quot;Skip to content&quot; link is the first thing you reach
            with Tab on every page.
          </li>
          <li>
            Form fields have labels that screen readers read out, and dialogs
            are announced as dialogs.
          </li>
          <li>
            Errors on the waitlist and booking forms are read out by screen
            readers as they appear, and so is the confirmation when you join
            the launch waitlist.
          </li>
          <li>
            The video on the home page has a pause button. If your system asks
            for reduced motion, the video stays paused and decorative
            animations stop. Loading spinners still turn.
          </li>
          <li>
            Images that carry meaning have text alternatives; decorative ones
            are hidden from assistive tech.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="ongoing" title="Where we are honestly">
        <p>
          The site is young and we audit it as we build. We haven&apos;t
          finished: a few small labels still fall below the contrast target,
          and the ordering pages that open at launch haven&apos;t had this pass
          yet.
        </p>
        <p>
          Some pieces come from outside providers, like the Stripe payment
          form and the maps, and we don&apos;t fully control how accessible
          they are.
        </p>
        <p>
          If you hit something that doesn&apos;t work with your screen reader,
          keyboard, or magnifier, that&apos;s a bug to us and it gets fixed like
          one.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Tell us">
        <p>
          Email <LegalMail /> with the page and what got in your way. A founder
          reads these. You won&apos;t be routed through three departments. If
          you can&apos;t complete an order because of an accessibility barrier,
          say so and we&apos;ll take the order another way while we fix it.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
