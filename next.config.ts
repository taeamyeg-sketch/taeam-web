import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'export',
  // Static export has no image-optimization server, so next/image must use
  // the raw files. We still get lazy-loading, correct intrinsic sizing, and
  // CLS protection from the component.
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
