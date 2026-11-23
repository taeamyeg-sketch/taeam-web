import type { MetadataRoute } from "next";

// Static export bakes manifest.webmanifest at build time.
export const dynamic = "force-static";

/**
 * Web app manifest. Gives browsers, Android and search engines the brand name
 * spelled the one right way ("Taeam") instead of guessing it from the title.
 *
 * display is "browser" on purpose: this is the marketing site, not an app, so
 * it should not offer an install prompt. The real apps are in the stores.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Taeam",
    short_name: "Taeam",
    description:
      "Taeam is Edmonton's halal food delivery app. Every kitchen on Taeam is halal, verified not filtered.",
    start_url: "/",
    display: "browser",
    background_color: "#faf6ee",
    theme_color: "#faf6ee",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
