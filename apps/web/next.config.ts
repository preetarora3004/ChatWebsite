import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // transpilePackages : ["@repo/utils"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
