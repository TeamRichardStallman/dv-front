import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "k.kakaocdn.net",
      process.env.NEXT_PUBLIC_S3_BUCKET_DOMAIN || "ktb-8-dev-bucket.s3.ap-northeast-2.amazonaws.com",
      "via.placeholder.com",
    ],
  },
  output: "standalone",
  reactStrictMode: false,
};

export default nextConfig;
