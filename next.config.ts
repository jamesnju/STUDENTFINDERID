import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000', // If using a custom port
        pathname: '/uploads/**', // Path to allow for image fetching
      },
      {
        protocol: 'https',
        hostname: 'studentidapis.vercel.app', // Add the Vercel URL here
        pathname: '/uploads/**', // Path to allow for image fetching
      },
    ],
  },
  }


export default nextConfig;
