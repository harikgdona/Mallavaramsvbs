/** @type {import('next').NextConfig} */
// In local dev, a non-empty basePath causes `http://localhost:3000/` to 404.
// Keep the basePath only for production/static export (e.g. GitHub Pages).
const PROD_BASE_PATH = "/Mallavaramsvbs";
const basePath = process.env.NODE_ENV === "production" ? PROD_BASE_PATH : "";

// Hostnames you use in the browser bar for `next dev` (HMR WebSocket is blocked if missing).
const extraDevOrigins =
  process.env.NEXT_DEV_EXTRA_ORIGINS?.split(/[\s,]+/).filter(Boolean) ?? [];

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.0.3",
    "192.168.0.6",
    ...extraDevOrigins
  ],
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  reactStrictMode: true,
  images: {
    unoptimized: true,
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  }
};
export default nextConfig;
