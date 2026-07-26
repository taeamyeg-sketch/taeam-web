import type { Metadata, Viewport } from "next";
import { Montserrat, Reem_Kufi } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { AppSuggestBanner } from "@/components/AppSuggestBanner";
import { CartProvider } from "@/components/cart/CartContext";
import { CartUI } from "@/components/cart/CartUI";
import { PageTransitionProvider } from "@/components/transition/PageTransition";
import { LaunchGate } from "@/components/LaunchGate";
import { CookieConsent } from "@/components/CookieConsent";
import { WaitlistModal } from "@/components/WaitlistModal";
import { SEALED } from "@/lib/launch";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

// Arabic display face for the طعام wordmark. Reem Kufi is a bold, geometric
// Kufic designed to pair with Latin sans — it matches the uppercase TAEAM mark
// and, crucially, renders identically on every device (previously the wordmark
// fell back to whatever Arabic font the visitor's OS happened to ship).
const reemKufi = Reem_Kufi({
  subsets: ["arabic"],
  variable: "--font-reem",
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
      <body
        className={`${montserrat.variable} ${reemKufi.variable} antialiased`}
      >
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
