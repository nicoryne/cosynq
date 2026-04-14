import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Performance optimizations
  experimental: {
    // Optimize package imports for better tree-shaking
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Enable bundle analyzer when ANALYZE=true
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any) => {
      // Bundle analyzer will be added via plugin if needed
      return config;
    },
  }),
};

export default nextConfig;
