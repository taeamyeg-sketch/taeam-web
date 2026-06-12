import Link from 'next/link';
import { ArrowLeft, Smartphone } from 'lucide-react';

/**
 * Shared, read-only "open in app" skeleton used by every email deep-link path
 * (see backend/lib/email-templates/DEEP_LINKING.md). One URL, device-dependent
 * behavior: on a phone with the app installed the OS opens the app via Universal
 * Links / App Links before this page ever renders; on desktop or an uninstalled
 * device this page is the graceful fallback so the tap isn't a dead end.
 *
 * Stays a server component (no client JS) — it's a static skeleton + links.
 */

export type AppBrand = 'taeam' | 'tawsil' | 'merchant';

const BRANDS: Record<
  AppBrand,
  {
    label: string;
    accent: string; // hex
    appStore: string;
    playStore: string;
  }
> = {
  // Customer app — Taeam (gold).
  taeam: {
    label: 'Taeam',
    accent: '#EAB308',
    appStore: 'https://apps.apple.com/app/taeam',
    playStore: 'https://play.google.com/store/apps/details?id=com.taeam.taeam_app',
  },
  // Driver app — user-facing brand is Tawsil (gold, dark theme).
  tawsil: {
    label: 'Tawsil',
    accent: '#EAB308',
    appStore: 'https://apps.apple.com/app/tawsil',
    playStore: 'https://play.google.com/store/apps/details?id=com.taeam.taeam_driver',
  },
  // Restaurant merchant app.
  merchant: {
    label: 'Taeam for Restaurants',
    accent: '#EAB308',
    appStore: 'https://apps.apple.com/app/taeam-restaurant',
    playStore: 'https://play.google.com/store/apps/details?id=com.taeam.taeam_restaurant',
  },
};

export function AppFallback({
  brand,
  title,
  subtitle,
  deepLink,
  detail,
}: {
  brand: AppBrand;
  title: string;
  subtitle: string;
  /** Custom-scheme deep link, e.g. taeam://orders/123/track */
  deepLink: string;
  /** Optional small read-only context line (e.g. an order id). */
  detail?: string;
}) {
  const b = BRANDS[brand];

  return (
    <main className="min-h-screen bg-[#F6F4EF] font-sans text-[#1A1A1A] antialiased">
      {/* NAV */}
      <nav className="flex items-center justify-between border-b border-black/5 bg-[#F6F4EF]/85 px-5 py-3.5 backdrop-blur-md sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-bold text-[#1A1A1A] transition-opacity hover:opacity-60"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Taeam
        </Link>
        <img src="/taeam-logo.jpg" alt="Taeam" className="h-9 w-9 rounded-full" />
      </nav>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)]">
          {/* accent cap */}
          <div
            className="h-1.5 w-full"
            style={{ backgroundColor: b.accent }}
          />
          <div className="p-7 sm:p-9">
            <div
              className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${b.accent}1f`, color: '#B7791F' }}
            >
              <Smartphone className="h-6 w-6" />
            </div>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B7791F]">
              {b.label}
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase leading-[0.95] tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-[#52504A]">{subtitle}</p>

            {detail && (
              <p className="mt-4 inline-block rounded-full bg-black/5 px-3 py-1 font-mono text-xs text-[#6B6963]">
                {detail}
              </p>
            )}

            {/* Open-in-app CTA (custom scheme) */}
            <a
              href={deepLink}
              className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-6 py-3.5 text-sm font-black uppercase tracking-wide text-white transition-all hover:bg-black active:scale-[0.98]"
            >
              Open in the {b.label} app
            </a>

            <p className="mt-5 text-center text-xs text-[#8A8880]">
              Don&apos;t have the app yet? Get it below.
            </p>

            {/* Store links */}
            <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
              <a
                href={b.appStore}
                className="flex flex-1 items-center justify-center rounded-xl border border-black/10 bg-[#FAFAF8] px-4 py-3 text-sm font-bold text-[#1A1A1A] transition-colors hover:border-[#EAB308] hover:bg-white"
              >
                App Store
              </a>
              <a
                href={b.playStore}
                className="flex flex-1 items-center justify-center rounded-xl border border-black/10 bg-[#FAFAF8] px-4 py-3 text-sm font-bold text-[#1A1A1A] transition-colors hover:border-[#EAB308] hover:bg-white"
              >
                Google Play
              </a>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-md text-center text-xs leading-relaxed text-[#9A988F]">
          If you have the {b.label} app installed on your phone, this link opens
          it automatically. This page is the fallback for desktop browsers and
          devices without the app.
        </p>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div className="py-6 text-center">
        <p className="text-xs uppercase tracking-wider text-[#A8A69E]">
          © 2026 Taeam Technologies Inc.
        </p>
      </div>
    </main>
  );
}
