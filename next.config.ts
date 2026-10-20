import type { NextConfig } from "next";
import { parseServerEnvironment } from "./src/server/env/schema";

// Next.js loads .env files before evaluating its configuration.
parseServerEnvironment({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
