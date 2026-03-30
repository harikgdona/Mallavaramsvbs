/** @type {import('next').NextConfig} */
// In local dev, a non-empty basePath causes `http://localhost:3000/` to 404.
// Production: SITE_BASE_PATH="" (default) for a custom domain at the root, e.g. https://Mallavaramsvbs.org/
// Set SITE_BASE_PATH=/repo-name only if you use https://<user>.github.io/<repo>/ without a custom domain.
const PROD_BASE_PATH = process.env.SITE_BASE_PATH ?? "";
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
    "10.2.158.94",
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
