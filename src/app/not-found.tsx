import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Khatam } from "@/components/Pattern";
import { SEALED, orderHref } from "@/lib/launch";
import { JoinWaitlistButton } from "@/components/JoinWaitlistButton";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[70svh] flex-col items-center justify-center px-4 pt-20 text-center">
        <Khatam className="h-8 w-8 text-gold" />
        <h1 className="mt-6 font-black uppercase tracking-tight text-4xl text-ink">
          This plate is empty.
        </h1>
        <p className="mt-3 max-w-sm text-ink-mute">
          The page you&apos;re after doesn&apos;t exist, but the food does.
        </p>
        {SEALED ? (
          <JoinWaitlistButton className="mt-8 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink">
            Join the waitlist
          </JoinWaitlistButton>
        ) : (
          <Link
            href={orderHref()}
            className="mt-8 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink"
          >
            Browse restaurants
          </Link>
        )}
      </main>
      <Footer />
    </>
  );
}
