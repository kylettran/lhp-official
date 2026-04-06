import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '26mb',
    },
  },
  images: {
    remotePatterns: [{ hostname: 'cdn.sanity.io' }],
    deviceSizes: [390, 640, 828, 1080, 1200, 1920],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/artists/katherine-de-leon',
        destination: '/artists/kat',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
