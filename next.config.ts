import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "k.kakaocdn.net",
      "ktb-8-dev-bucket.s3.ap-northeast-2.amazonaws.com",
      "via.placeholder.com",
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
