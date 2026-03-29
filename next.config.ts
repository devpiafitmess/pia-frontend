import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  allowedDevOrigins: ["ec57-38-25-56-59.ngrok-free.app"],
};

export default nextConfig;
