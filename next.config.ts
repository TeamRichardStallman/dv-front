import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "k.kakaocdn.net",
      process.env.NEXT_PUBLIC_S3_BUCKET_DOMAIN as string,
      "via.placeholder.com",
    ],
  },
  output: "standalone",
  reactStrictMode: false,
};

export default nextConfig;
