import type { Metadata, Viewport } from "next";
import { Montserrat, Amiri } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { AppSuggestBanner } from "@/components/AppSuggestBanner";
import { CartProvider } from "@/components/cart/CartContext";
import { CartUI } from "@/components/cart/CartUI";
import { PageTransitionProvider } from "@/components/transition/PageTransition";
import { LaunchGate } from "@/components/LaunchGate";
import { CookieConsent } from "@/components/CookieConsent";
import { MetaPixel } from "@/components/MetaPixel";
import { WaitlistModal } from "@/components/WaitlistModal";
import { SEALED } from "@/lib/launch";
import { META_PIXEL_BASE_CODE, META_PIXEL_ID } from "@/lib/meta-pixel";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

// Arabic display face for the طعام wordmark and all Arabic on the site. Amiri
// is a classical Naskh built for formal and Quranic typesetting; it is the same
// face the /halal research pages use, so Arabic renders identically everywhere
// (previously the wordmark fell back to whatever the visitor's OS shipped).
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  // Absolute base for OG/twitter images and canonicals; without it social
  // scrapers get relative (broken) image URLs.
  metadataBase: new URL("https://taeam.ca"),
  title: {
    default: "Taeam · Halal food delivered in Edmonton",
    template: "%s · Taeam",
  },
  description:
    "Every kitchen on Taeam is halal. Verified, not filtered. Local Edmonton kitchens, delivered to your door.",
  openGraph: {
    title: "Taeam · Taste the trust.",
    description:
      "Every kitchen on Taeam is halal. Verified, not filtered. Edmonton kitchens, delivered hot.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    siteName: "Taeam",
  },
  // Indexable by default. What is actually crawlable is decided in one place,
  // app/robots.ts, which follows the SEALED flag; pages that must stay out of
  // search (account, orders, merchant, driver) set `robots: { index: false }`
  // in their own metadata and still win over this default.
  robots: { index: true, follow: true },
  // The same build is served from taeam.ca AND taeam-website.pages.dev. Without
  // a canonical, both get indexed and compete with each other for the same
  // queries. "./" resolves per route against metadataBase, so every page points
  // at its taeam.ca address.
  alternates: { canonical: "./" },
};

export const viewport: Viewport = {
  themeColor: "#faf6ee",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Meta pixel base code, inline in <head> on every page — Meta's
            standard install. Runs before hydration so a bounce still counts.
            Route-change PageViews come from <MetaPixel /> below. */}
        <script dangerouslySetInnerHTML={{ __html: META_PIXEL_BASE_CODE }} />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </head>
      <body
        className={`${montserrat.variable} ${amiri.variable} antialiased`}
      >
        <MetaPixel />
        <AuthProvider>
          <CartProvider>
            <PageTransitionProvider>
              {children}
              <LaunchGate />
              {!SEALED && <CartUI />}
              {!SEALED && <AuthModal />}
              {!SEALED && <AppSuggestBanner />}
              <CookieConsent />
              {SEALED && <WaitlistModal />}
            </PageTransitionProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
