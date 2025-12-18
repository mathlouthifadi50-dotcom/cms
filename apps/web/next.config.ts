import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
        },
        {
          protocol: 'http',
          hostname: 'strapi',
        },
        {
          protocol: 'https',
          hostname: 'localhost',
        },
        {
          protocol: 'https',
          hostname: 'strapi',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
      ],
    },
};

export default nextConfig;
