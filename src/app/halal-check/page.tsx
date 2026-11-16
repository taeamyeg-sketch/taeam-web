import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/Eyebrow";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Rule } from "@/components/Pattern";
import { HalalCheckClient } from "./HalalCheckClient";

/**
 * The public Taeam halal lookup (GROCERY_PLAN G-38). Free, no sign-in.
 *
 * The search itself is a client component (anon RPCs, see HalalCheckClient).
 * The two sections below it are static: "How we check" is what the "How we
 * check" link on an assessed result points at, and "About these results" is
 * the lookup terms (plan section 9.2). Those terms are a notice, not an
 * acceptance, because nobody signs in here.
 *
 * Copy rules for this page: no em or en dashes, no store names, no competitor
 * names, no "cheaper than", and never a bare "Halal" or "Not halal" label.
 */
export const metadata: Metadata = {
  title: "Halal product check",
  description:
    "Search a grocery product by name, brand or barcode to see whether Taeam has checked it, which certifier certifies it, and what we found. Free, with no sign-in.",
};

const TERMS: { term: string; meaning: string }[] = [
  {
    term: "Certified halal by [certifier]",
    meaning:
      "The certifier named in full certifies this product. The date shown is the date its certificate runs until.",
  },
  {
    term: "Halal status assessed by Taeam Technologies Inc.",
    meaning:
      "No halal certificate on file covers this product, so we checked its ingredients against the Taeam standard on the date shown.",
  },
  {
    term: "Flagged",
    meaning:
      "The product passed, but it contains an ingredient that some people avoid. We name it so you can decide.",
  },
  {
    term: "Not listed",
    meaning:
      "The product contains an ingredient that fails the Taeam standard. We name the ingredient.",
  },
  {
    term: "Not checked yet",
    meaning:
      "We have not finished checking this product. It says nothing either way about the product, only that we have not checked it. You can ask us to check it.",
  },
];

export default function HalalCheckPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
        <HalalCheckClient />

        <section id="how-we-check" aria-labelledby="how-we-check-title" className="mt-16">
          <Rule className="mb-8" />
          <Eyebrow>The two tiers</Eyebrow>
          <h2 id="how-we-check-title" className="mt-3 text-2xl font-semibold tracking-tight text-ink">
            How we check
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">
            <p>
              <strong className="font-semibold text-ink">Certified.</strong> A halal certifier
              certifies the product. We keep a copy of the certificate, name the certifier in
              full, and show the date the certificate runs until.
            </p>
            <p>
              <strong className="font-semibold text-ink">Assessed by Taeam.</strong> When no
              certificate covers a product, we read its ingredients from a photo of the label and
              check each one against the Taeam standard. Anything the label alone cannot settle is
              confirmed with the maker or a certificate before the product can pass. We show the
              date we checked.
            </p>
            <p>
              Some ingredients are accepted by some people and avoided by others. A product with
              one of those can still pass, and we flag the ingredient so you can decide.
            </p>
            <p>
              Taeam is not a halal certifier. An assessed result means we checked the ingredients
              against our standard; it is not a certificate. More on how Taeam checks restaurants:{" "}
              <Link className="link-underline text-gold-deep" href="/how-we-verify">
                how we verify
              </Link>
              .
            </p>
          </div>
        </section>

        <section aria-labelledby="lookup-terms-title" className="mt-14">
          <div className="rounded-2xl border border-cream-line bg-cream-deep px-5 py-6 sm:px-7">
            <h2 id="lookup-terms-title" className="text-lg font-semibold tracking-tight text-ink">
              About these results
            </h2>
            <dl className="mt-4 divide-y divide-cream-line text-sm">
              {TERMS.map(({ term, meaning }) => (
                <div key={term} className="py-3">
                  <dt className="font-semibold text-ink">{term}</dt>
                  <dd className="mt-1 leading-relaxed text-ink-soft">{meaning}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
              <p>
                Results reflect Taeam&rsquo;s checks on the date shown. Makers change recipes and
                suppliers, so a product can change after we check it.
              </p>
              <p>
                <strong className="font-semibold text-ink">
                  The label on the product is what counts.
                </strong>{" "}
                We copy ingredients carefully, but read the label before you buy or eat, especially
                if you have an allergy.
              </p>
              <p>
                Taeam is not affiliated with the brands shown here or with the stores that sell
                them. Brand names belong to their owners. Some product photos come from Open Food
                Facts under the CC BY-SA licence and are credited where they appear.
              </p>
              <p>
                The lookup is free and needs no sign-in. Think a result is wrong? Email{" "}
                <a className="link-underline text-gold-deep" href="mailto:contact@taeam.ca">
                  contact@taeam.ca
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
