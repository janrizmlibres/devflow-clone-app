import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://static.vecteezy.com/**")],
  },
};

export default nextConfig;
