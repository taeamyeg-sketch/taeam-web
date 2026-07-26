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
      updated="July 2026"
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
            Text and interface colours are checked for contrast, including the
            brand gold, which we darken wherever it carries text on light
            backgrounds.
          </li>
          <li>
            Everything reachable by mouse is reachable by keyboard, with a
            visible focus ring on every control.
          </li>
          <li>
            Dialogs, menus and forms carry proper labels and roles for screen
            readers.
          </li>
          <li>
            Animations respect your system&apos;s &quot;reduce motion&quot;
            setting. Turn it on and the site holds still.
          </li>
          <li>
            Images that carry meaning have text alternatives; decorative ones
            are hidden from assistive tech.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="ongoing" title="Where we are honestly">
        <p>
          The site is young and we audit it as we build. Some third-party
          pieces (the payment form, the map) come from providers whose
          accessibility we don&apos;t fully control, though we choose providers
          (Stripe, Google) with strong accessibility records of their own.
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
