import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Use TypeScript 5's compiler API rather than starting a separate CLI process.
    useTypeScriptCli: false,
  },
};

export default nextConfig;
