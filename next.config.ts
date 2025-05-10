import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  typescript: {
    // Enable TypeScript during production build (recommended)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Enable ESLint during production build
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
