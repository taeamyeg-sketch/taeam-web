import type { NextConfig } from "next";

// PREVIEW_EXPORT=1 builds a fully static site (out/) for the private
// Cloudflare Pages preview. Production will move to SSR before launch.
const isExport = !!process.env.PREVIEW_EXPORT;

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" as const } : {}),
  // Pin the workspace root: a stray lockfile in the home dir otherwise makes
  // Turbopack infer the wrong root and panic on Windows builds.
  turbopack: { root: __dirname },
  images: {
    unoptimized: isExport,
    remotePatterns: [
      { protocol: "https", hostname: "qpeoyqhillxhcrphwure.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
