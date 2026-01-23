import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Taeam - The Halal Dessert Revolution | Coming Soon",
  description: "Join the inner circle. Get 15% off your first order + 1000 Founding Member Points. Exclusive marketplace for halal desserts and AI-powered food discovery.",
  keywords: ["halal", "desserts", "food", "Edmonton", "marketplace", "AI", "Taeam"],
  openGraph: {
    title: "Taeam - The Halal Dessert Revolution",
    description: "Join the inner circle. Get 15% off your first order + 1000 Founding Member Points.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
