import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Allow 4MB image uploads plus multipart overhead within Vercel's 4.5MB cap.
    serverActions: { bodySizeLimit: "4.25mb" },
    // Use TypeScript 5's compiler API rather than starting a separate CLI process.
    useTypeScriptCli: false,
  },
};

export default nextConfig;
