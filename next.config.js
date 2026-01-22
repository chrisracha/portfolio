/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true
  },
  // Change this to your repo name if deploying to username.github.io/repo-name
  // Leave empty if deploying to username.github.io
  basePath: process.env.NODE_ENV === "production" ? "/portfolio" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/portfolio" : ""
};

module.exports = nextConfig;

