// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  swcMinify: false,
  experimental: {
    turbo: false, // Turbopack–³Œø
  },
};

export default nextConfig;
