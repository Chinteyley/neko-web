import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // static HTML so Vercel serves `/` even if the project preset is empty
  output: "export",
};

export default nextConfig;
