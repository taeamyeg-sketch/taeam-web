import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/Eyebrow";
import { Khatam } from "./Pattern";
import { SEALED } from "@/lib/launch";

/**
 * Apple logo + "Download on the App Store". A self-contained placeholder badge
 * (store URLs get wired later) drawn with the real Apple glyph so it reads as
 * the genuine article, styled to sit on the noir footer.
 */
function AppStoreBadge() {
  return (
    <StoreBadge
      label="Download on the App Store"
      top="Download on the"
      bottom="App Store"
    >
      <svg viewBox="0 0 16 16" aria-hidden className="h-6 w-6 shrink-0 fill-cream">
        <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z" />
      </svg>
    </StoreBadge>
  );
}

/** "Get it on Google Play" placeholder with the four-colour play triangle. */
function GooglePlayBadge() {
  return (
    <StoreBadge
      label="Get it on Google Play"
      top="Get it on"
      bottom="Google Play"
    >
      <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 shrink-0">
        <path fill="#00C3FF" d="M3.9 2.3a1.5 1.5 0 0 0-.9 1.4v16.6a1.5 1.5 0 0 0 .9 1.4l9.3-9.7L3.9 2.3z" />
        <path fill="#00E676" d="M16.9 8.8 5.6 2.2A1.5 1.5 0 0 0 3.9 2.3l9.3 9.7 3.7-3.2z" />
        <path fill="#FF3D57" d="M3.9 21.7a1.5 1.5 0 0 0 1.7.1l11.3-6.6-3.7-3.2-9.3 9.7z" />
        <path fill="#FFC400" d="M16.9 8.8l-3.7 3.2 3.7 3.2 3.6-2.1c1.1-.6 1.1-2.1 0-2.7l-3.6-1.6z" />
      </svg>
    </StoreBadge>
  );
}

function StoreBadge({
  children,
  label,
  top,
  bottom,
}: {
  children: React.ReactNode;
  label: string;
  top: string;
  bottom: string;
}) {
  // Pre-launch: the apps aren't on the stores yet, so the badges are
  // non-clickable "coming soon" placeholders (dimmed, no link) rather than
  // buttons that dead-end on a missing store listing.
  return (
    <span
      aria-label={`${label} — coming soon`}
      className="inline-flex cursor-default items-center gap-3 rounded-xl border border-cream/20 bg-white/[0.04] px-4 py-2.5 opacity-60"
    >
      {children}
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-medium tracking-wide text-cream/60">{top}</span>
        <span className="mt-1 text-[15px] font-semibold tracking-tight text-cream">{bottom}</span>
      </span>
    </span>
  );
}

export function Footer() {
  return (
    <footer className="bg-noir text-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.4fr] lg:gap-20">
          {/* Brand + app badges */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo-mark.png"
                alt=""
                width={26}
                height={30}
                className="h-7 w-auto invert"
              />
              <span className="text-2xl font-black uppercase tracking-tight">Taeam</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream/60">
              Halal food, delivered. Every kitchen on Taeam is halal. Verified,
              not filtered.
            </p>

            <div className="mt-7">
              <Eyebrow tone="bright" className="mb-3">
                Coming soon
              </Eyebrow>
              <div className="flex flex-wrap gap-3">
                <AppStoreBadge />
                <GooglePlayBadge />
              </div>
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 text-sm md:grid-cols-4">
            <div>
              <Eyebrow tone="bright" className="mb-3.5">
                Eat
              </Eyebrow>
              <ul className="space-y-1">
                {!SEALED && (
                  <li>
                    <Link href="/restaurants" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                      Restaurants
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/halal" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    The halal standard
                  </Link>
                </li>
                <li>
                  <Link href="/halal/hand-vs-machine" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    Hand or machine
                  </Link>
                </li>
                <li>
                  <Link href="/how-we-verify" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    How we verify
                  </Link>
                </li>
                <li>
                  <Link href="/arbaab" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    Arbaab
                  </Link>
                </li>
                <li>
                  <Link href="/rewards" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    Rewards &amp; Taeam Plus
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <Eyebrow tone="bright" className="mb-3.5">
                Partner
              </Eyebrow>
              <ul className="space-y-1">
                <li>
                  <span className="cursor-default text-cream/40" title="Coming soon">
                    Add your restaurant
                  </span>
                </li>
                <li>
                  <Link href="/drive" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    Drive with Taeam
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <Eyebrow tone="bright" className="mb-3.5">
                Company
              </Eyebrow>
              <ul className="space-y-1">
                <li>
                  <Link href="/about" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    Our story
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    Help &amp; support
                  </Link>
                </li>
                <li>
                  <a
                    href="https://instagram.com/taeam.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@taeam.ca" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <Eyebrow tone="bright" className="mb-3.5">
                Legal
              </Eyebrow>
              <ul className="space-y-1">
                <li>
                  <Link href="/terms" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    Cookies &amp; Storage
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    Accessibility
                  </Link>
                </li>
                <li>
                  <Link href="/terms#refunds" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    Refund policy
                  </Link>
                </li>
                <li>
                  <Link href="/delete-account" className="inline-block py-1.5 text-cream/70 transition-colors hover:text-gold-bright">
                    Delete your account
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start gap-4 border-t border-cream/10 pt-6 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2.5">
            <Khatam className="h-3.5 w-3.5 text-gold-bright/60" />
            © 2026 Taeam Technologies Inc. · Edmonton, Alberta · All rights reserved.
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/terms" className="transition-colors hover:text-cream">
              Terms
            </Link>
            <Link href="/privacy-policy" className="transition-colors hover:text-cream">
              Privacy
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-cream">
              Cookies
            </Link>
            <Link href="/accessibility" className="transition-colors hover:text-cream">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
