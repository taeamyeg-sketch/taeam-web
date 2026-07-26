import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Divider } from "@/components/Pattern";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Reveal } from "@/components/Reveal";
import { getRestaurants } from "@/lib/data";
import type { Restaurant } from "@/lib/types";

/**
 * SEO cuisine pages: /edmonton/donair, /edmonton/shawarma, …
 * Generated from the categories restaurants actually declare, so a new
 * cuisine in the database becomes a landing page on the next build.
 */

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// "Halal" is the whole site, not a cuisine page of its own.
const EXCLUDED = new Set(["halal"]);

function cuisinesOf(restaurants: Restaurant[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const r of restaurants) {
    for (const c of r.categories ?? []) {
      const slug = slugify(c);
      if (!EXCLUDED.has(slug) && !map.has(slug)) map.set(slug, c);
    }
  }
  return map;
}

export async function generateStaticParams() {
  const restaurants = await getRestaurants();
  return [...cuisinesOf(restaurants).keys()].map((cuisine) => ({ cuisine }));
}

type Params = { params: Promise<{ cuisine: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { cuisine } = await params;
  const restaurants = await getRestaurants();
  const name = cuisinesOf(restaurants).get(cuisine);
  if (!name) return { title: "Not found" };
  return {
    title: `Halal ${name} delivery in Edmonton`,
    description: `Order halal ${name.toLowerCase()} in Edmonton on Taeam. Every kitchen verified halal, delivered hot to your door.`,
  };
}

export default async function CuisinePage({ params }: Params) {
  const { cuisine } = await params;
  const restaurants = await getRestaurants();
  const name = cuisinesOf(restaurants).get(cuisine);
  if (!name) notFound();

  const matches = restaurants.filter((r) =>
    (r.categories ?? []).some((c) => slugify(c) === cuisine),
  );

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-deep">
            Edmonton
          </p>
          <h1 className="mt-3 break-words font-black uppercase tracking-tight text-3xl text-ink sm:text-5xl">
            Halal {name.toLowerCase()}, delivered.
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-ink-mute">
            Every {name.toLowerCase()} kitchen on Taeam is halal, verified by
            us, not self-declared through a filter. Order below, or browse{" "}
            <Link href="/restaurants" className="underline underline-offset-4">
              everything in Edmonton
            </Link>
            .
          </p>
        </Reveal>

        <div className="mt-14 space-y-12">
          {matches.map((r, i) => (
            <Reveal key={r.id}>
              <div className="space-y-12">
                {i > 0 && <Divider />}
                <RestaurantCard restaurant={r} flip={i % 2 === 1} />
              </div>
            </Reveal>
          ))}
        </div>

        {matches.length === 0 && (
          <p className="py-24 text-center text-ink-mute">
            No {name.toLowerCase()} kitchens yet. They&rsquo;re coming.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
