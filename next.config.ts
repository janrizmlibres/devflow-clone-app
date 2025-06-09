import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    remotePatterns: [new URL("https://static.vecteezy.com/**")],
  },
};

export default nextConfig;
