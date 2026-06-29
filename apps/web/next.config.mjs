/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@instalovon/shared", "@instalovon/db", "@instalovon/ai"],
  experimental: {
    serverActions: { allowedOrigins: ["*"] },
  },
};

export default nextConfig;
