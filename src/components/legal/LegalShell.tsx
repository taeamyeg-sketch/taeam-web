import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { cn } from "@/lib/cn";

/**
 * Shared frame for the legal pages (terms, privacy, cookies, accessibility).
 * One consistent look: site header + footer, a sticky doc switcher on desktop,
 * and plain prose sections separated by hairlines — no card boxes, the way
 * legal pages read on grown-up sites. Sections get anchor ids via LegalSection
 * so the footer and terms can deep-link (e.g. /terms#refunds).
 */

export const LEGAL_DOCS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookies & Storage" },
  { href: "/accessibility", label: "Accessibility" },
] as const;

export function LegalShell({
  current,
  title,
  updated,
  intro,
  children,
}: {
  current: (typeof LEGAL_DOCS)[number]["href"];
  title: string;
  updated: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
        <div className="lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block">
            <nav aria-label="Legal pages" className="sticky top-28">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-mute">
                Legal
              </p>
              <ul className="mt-4 border-l border-cream-line">
                {LEGAL_DOCS.map((d) => (
                  <li key={d.href}>
                    <Link
                      href={d.href}
                      aria-current={current === d.href ? "page" : undefined}
                      className={cn(
                        "-ml-px block border-l-2 py-3 pl-4 text-sm transition-colors",
                        current === d.href
                          ? "border-gold font-bold text-ink"
                          : "border-transparent text-ink-mute hover:border-cream-line hover:text-ink",
                      )}
                    >
                      {d.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <article className="mx-auto max-w-2xl lg:mx-0">
            <header>
              <h1 className="break-words text-3xl font-black uppercase tracking-tight text-ink min-[400px]:text-4xl sm:text-5xl">
                {title}
              </h1>
              <p className="mt-3 text-sm font-semibold text-gold-deep">
                Last updated: {updated}
              </p>
              {intro && (
                <p className="mt-6 leading-relaxed text-ink-mute">{intro}</p>
              )}
            </header>

            {/* Phones/tablets have no sidebar, so surface the doc switcher up top too. */}
            <nav
              aria-label="Legal pages"
              className="-mx-4 mt-8 flex gap-x-2 overflow-x-auto whitespace-nowrap px-4 sm:-mx-6 sm:px-6 lg:hidden"
            >
              {LEGAL_DOCS.map((d) => (
                <Link
                  key={d.href}
                  href={d.href}
                  aria-current={current === d.href ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
                    current === d.href
                      ? "border-gold bg-gold/10 text-ink"
                      : "border-cream-line text-ink-mute hover:text-ink",
                  )}
                >
                  {d.label}
                </Link>
              ))}
            </nav>

            <div className="mt-12 space-y-10">{children}</div>

            {/* On phones the sidebar is gone, so the doc switcher lands here. */}
            <nav
              aria-label="Legal pages"
              className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-cream-line pt-6 lg:hidden"
            >
              {LEGAL_DOCS.filter((d) => d.href !== current).map((d) => (
                <Link
                  key={d.href}
                  href={d.href}
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-gold-deep underline decoration-gold-deep/40 underline-offset-2 transition-colors hover:text-ink hover:decoration-gold-deep"
                >
                  {d.label}
                </Link>
              ))}
            </nav>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-cream-line pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-lg font-black uppercase tracking-tight text-ink">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-mute">
        {children}
      </div>
    </section>
  );
}

/** Inline mail link, styled once. */
export function LegalMail({ children = "contact@taeam.ca" }: { children?: string }) {
  return (
    <a
      href={`mailto:${children}`}
      className="font-medium text-gold-deep underline decoration-gold-deep/40 underline-offset-2 [overflow-wrap:anywhere] hover:decoration-gold-deep"
    >
      {children}
    </a>
  );
}
