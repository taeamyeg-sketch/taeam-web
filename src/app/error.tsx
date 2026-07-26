"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Khatam } from "@/components/Pattern";

/**
 * Route-level error boundary. Catches render/data failures below the layout and
 * shows a calm, on-brand recovery screen instead of a stack trace. Mirrors the
 * not-found page so a broken page and a missing page feel like the same site.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the failure for debugging without showing it to the visitor.
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="flex min-h-[70svh] flex-col items-center justify-center px-4 pt-20 text-center">
        <Khatam className="h-8 w-8 text-gold" />
        <h1 className="mt-6 font-black uppercase tracking-tight text-4xl text-ink">
          Something went wrong
        </h1>
        <p className="mt-3 max-w-sm text-ink-mute">
          We hit a snag loading this. Give it another go.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={reset}
            className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-px"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-sm font-medium text-ink-mute underline-offset-4 hover:text-ink hover:underline"
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
