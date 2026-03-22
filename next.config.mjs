/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/Mallavaramsvbs",
  // Required for GitHub Pages project sites so /_next and /images resolve under the repo path
  assetPrefix: "/Mallavaramsvbs",
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
