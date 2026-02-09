import type { NextConfig } from "next";

const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend:8000/api/:path*", // Proxy to Backend
      },
      {
        source: "/admin/:path*",
        destination: "http://backend:8000/admin/:path*", // Proxy Admin
      },
      {
        source: "/static/:path*",
        destination: "http://backend:8000/static/:path*", // Proxy Static files (admin style)
      },
    ];
  },
};

export default nextConfig;
