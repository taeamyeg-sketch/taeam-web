import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BrowseHome } from "@/components/browse/BrowseHome";
import { getRestaurants } from "@/lib/data";

export const metadata: Metadata = {
  title: "Order halal food in Edmonton",
  description:
    "Browse every halal kitchen on Taeam near you. Verified sourcing, transparent halal standards, delivery and pickup.",
};

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();

  return (
    <>
      <Header browse />
      {/* Laptop-first surface: wider cap than the marketing pages so big
          screens get a real desktop layout (sidebar + 4-col grid), not a
          centered phone column with acres of empty cream. */}
      <main className="mx-auto w-full max-w-[1720px] px-4 pb-24 pt-24 sm:px-6 sm:pt-28 xl:px-10">
        {restaurants.length === 0 ? (
          <p className="py-32 text-center text-ink-mute">
            Restaurants are being onboarded. Check back soon.
          </p>
        ) : (
          <BrowseHome restaurants={restaurants} />
        )}
      </main>
      <Footer />
    </>
  );
}
