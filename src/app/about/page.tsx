import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Divider, Khatam } from "@/components/Pattern";
import { Reveal } from "@/components/Reveal";
import { SEALED, orderHref } from "@/lib/launch";
import { JoinWaitlistButton } from "@/components/JoinWaitlistButton";

export const metadata: Metadata = {
  title: "About Taeam",
  description:
    "Taeam is Edmonton's halal food delivery platform. Every kitchen verified, built by the community it serves.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
        <Reveal>
          <p
            className="text-3xl text-gold"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: "var(--font-arabic)" }}
          >
            طعام
          </p>
          <h1 className="mt-4 font-black uppercase tracking-tight text-4xl leading-tight text-ink sm:text-5xl">
            We made halal the whole point.
          </h1>
        </Reveal>

        <Reveal>
          <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-ink-soft">
            <p>
              For everyone who&rsquo;s ever stood in front of a delivery app
              squinting at a menu, wondering if the chicken is actually halal.
              This is for you.
            </p>
            <p>
              The big platforms treat halal as a search filter. A checkbox
              nobody verifies, on a menu nobody reads twice. We built Taeam so
              the question never comes up: if a kitchen is on here, it&rsquo;s
              halal. We check the sourcing ourselves, we publish how the meat
              was prepared, and we put it on every restaurant page where you
              can see it.
            </p>
            <p>
              We&rsquo;re starting where we live, in Edmonton, Alberta. Local
              kitchens, local drivers, and a points program that gives back on
              every order. No venture-capital games, no ghost kitchens, no
              fine print.
            </p>
          </div>
        </Reveal>

        <Divider className="my-12" />

        <Reveal>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { big: "100%", small: "of kitchens halal, verified not filtered" },
              { big: "Edmonton", small: "born, built, and delivered here" },
              { big: "2026", small: "launching city-wide" },
            ].map((stat) => (
              <div key={stat.big}>
                <p className="font-black uppercase tracking-tight text-3xl text-ink">
                  {stat.big}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">
                  {stat.small}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-14 rounded-3xl bg-ink p-8 text-cream sm:p-10">
            <Khatam className="h-6 w-6 text-gold" />
            <h2 className="mt-4 font-black uppercase tracking-tight text-2xl sm:text-3xl">
              Hungry already?
            </h2>
            <p className="mt-2 text-cream/75">
              The founding restaurants are live. Come see who&rsquo;s cooking.
            </p>
            {SEALED ? (
              <JoinWaitlistButton className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink">
                Join the waitlist
              </JoinWaitlistButton>
            ) : (
              <Link
                href={orderHref()}
                className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink"
              >
                Browse restaurants
              </Link>
            )}
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
