// Structured data (schema.org JSON-LD) for search engines and AI assistants.
//
// Why this exists: "Taeam" reads like a typo of "team", and people who hear the
// name say it before they see it spelled. The Organization and WebSite blocks
// tell Google, Bing and AI crawlers, in a form they trust, that Taeam is a
// brand name and that Tayem, Taam, Ta'am and طعام all mean us. The WebSite
// block is also what Google reads to pick the site name shown above results.
//
// The same spellings appear in visible copy in exactly one place, the "How do
// you say Taeam?" section on /about. Keep them out of everywhere else: hidden
// or repeated name variants read as keyword stuffing.
//
// sameAs lists only profiles that the site already links to. Add a profile
// here only once it is real and linked from the site (Footer / ContactSection).

const SITE = "https://taeam.ca";

/** Every way people spell the name after hearing it. Visible on /about too. */
export const NAME_VARIANTS = ["Tayem", "Taam", "Ta'am", "طعام"];

export const SOCIAL_PROFILES = ["https://instagram.com/taeam.ca"];

const EDMONTON = {
  "@type": "City",
  name: "Edmonton",
  containedInPlace: {
    "@type": "AdministrativeArea",
    name: "Alberta",
    containedInPlace: { "@type": "Country", name: "Canada" },
  },
};

export const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "Taeam",
  legalName: "Taeam Technologies Inc.",
  alternateName: NAME_VARIANTS,
  url: SITE,
  logo: {
    "@type": "ImageObject",
    url: `${SITE}/icon.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE}/og.jpg`,
  slogan: "Taste the trust",
  description:
    "Taeam is a halal food delivery platform in Edmonton, Alberta. Every kitchen on Taeam is halal, verified rather than filtered.",
  areaServed: EDMONTON,
  email: "contact@taeam.ca",
  sameAs: SOCIAL_PROFILES,
};

export const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  name: "Taeam",
  alternateName: NAME_VARIANTS,
  url: SITE,
  inLanguage: "en-CA",
  publisher: { "@id": `${SITE}/#organization` },
};

/** Serialises JSON-LD for a <script> tag. Escapes "<" so no value can close it. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
