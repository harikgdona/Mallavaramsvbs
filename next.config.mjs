/** @type {import('next').NextConfig} */
const basePath = "/Mallavaramsvbs";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
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
