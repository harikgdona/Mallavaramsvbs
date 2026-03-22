/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/Mallavaramsvbs",
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
