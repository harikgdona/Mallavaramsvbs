/** @type {import('next').NextConfig} */
// In local dev, a non-empty basePath causes `http://localhost:3000/` to 404.
// Keep the basePath only for production/static export (e.g. GitHub Pages).
const PROD_BASE_PATH = "/Mallavaramsvbs";
const basePath = process.env.NODE_ENV === "production" ? PROD_BASE_PATH : "";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  // Allow accessing dev server via LAN IP (HMR/assets otherwise blocked).
  allowedDevOrigins: ["192.168.0.3"],
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
