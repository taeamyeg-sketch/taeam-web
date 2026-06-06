import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://taeam.ca"),
  title: "Taeam - Edmonton's Halal Food Delivery",
  description: "The only 100% halal food delivery app in Edmonton. Verified restaurants, home-baked goods from The Fridge, and Arbaab AI, your personal food assistant.",
  keywords: ["halal", "food delivery", "Edmonton", "halal delivery", "The Fridge", "Arbaab AI", "Taeam"],
  openGraph: {
    title: "Taeam - Edmonton's Halal Food Delivery",
    description: "The only 100% halal food delivery app in Edmonton. No guessing. No compromise.",
    type: "website",
    url: "https://taeam.ca",
    images: [
      {
        url: "/taeam-logo.png",
        width: 512,
        height: 512,
        alt: "Taeam - Halal Food Delivery Edmonton",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Taeam - Edmonton's Halal Food Delivery",
    description: "The only 100% halal food delivery app in Edmonton.",
    images: ["/taeam-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Taeam",
    legalName: "Taeam Technologies Inc.",
    description:
      "Edmonton's 100% halal food delivery platform. Verified halal restaurants, home-baked goods, and Arbaab AI.",
    url: "https://taeam.ca",
    email: "contact@taeam.ca",
    image: "https://taeam.ca/taeam-logo.png",
    logo: "https://taeam.ca/taeam-logo.png",
    areaServed: "Edmonton, Alberta, Canada",
    address: {
      "@type": "PostalAddress",
      streetAddress: "16506 21 Ave SW",
      addressLocality: "Edmonton",
      addressRegion: "AB",
      addressCountry: "CA",
    },
    sameAs: ["https://instagram.com/taeam.ca"],
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
