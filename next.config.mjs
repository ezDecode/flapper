/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  distDir: process.env.NEXT_BUILD_DIR || ".next",
};

export default nextConfig;
