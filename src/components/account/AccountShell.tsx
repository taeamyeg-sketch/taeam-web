"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/auth/AuthContext";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
];

/** Auth-guarded frame for all /account pages: header, tab nav, footer. */
export function AccountShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[70svh] max-w-6xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <h1 className="font-black uppercase tracking-tight text-3xl text-ink sm:text-4xl">
          Your Taeam
        </h1>
        <nav className="rail mt-6 flex gap-2 overflow-x-auto border-b border-cream-line pb-px">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "whitespace-nowrap rounded-t-xl px-4 py-3 text-sm font-semibold transition-colors",
                  active
                    ? "border-b-2 border-gold text-ink"
                    : "text-ink-mute hover:text-ink",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8">
          {loading || !user ? (
            <p className="py-16 text-center text-sm text-ink-mute">Loading…</p>
          ) : (
            children
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
