import type { Metadata } from "next";
import DriveClient from "./DriveClient";

// Tawsil is the driver brand, so /drive shares its own card, not the customer
// one (launch test plan B6 #47/#48). Regenerate with scripts/make-og.mjs.
export const metadata: Metadata = {
  title: "Drive with Tawsil",
  description:
    "Deliver with Tawsil, Taeam's driver app, in Edmonton. See your pay before you accept, keep 100% of tips, and drive on your own schedule.",
  openGraph: {
    title: "Drive with Tawsil",
    description:
      "Deliver in Edmonton on your own schedule. One order at a time, and tips are always 100% yours.",
    type: "website",
    url: "https://taeam.ca/drive",
    siteName: "Taeam",
    images: [
      {
        url: "/og-drive.png",
        width: 1200,
        height: 630,
        alt: "Drive with Tawsil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drive with Tawsil",
    images: ["/og-drive.png"],
  },
};

export default function DrivePage() {
  return <DriveClient />;
}
