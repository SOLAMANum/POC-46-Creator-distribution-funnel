import type { NextConfig } from "next";
import path from "path";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  ...(isVercel ? {} : {
    output: 'standalone',
    outputFileTracingRoot: path.resolve(__dirname),
  }),
  turbopack: {
    root: path.resolve(__dirname),
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;

