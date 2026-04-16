import type { NextConfig } from "next";

const rawBasePath = process.env.NEXT_BASE_PATH?.trim() || "";
const normalizedBasePath = rawBasePath
  ? rawBasePath.startsWith("/")
    ? rawBasePath
    : `/${rawBasePath}`
  : "";

const nextConfig: NextConfig = {
  ...(normalizedBasePath ? { basePath: normalizedBasePath } : {}),
  async redirects() {
    return [
      {
        // Source path
        source: "/",
        // Destination path
        destination: "/home",
        // Permanent redirect (301)
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
