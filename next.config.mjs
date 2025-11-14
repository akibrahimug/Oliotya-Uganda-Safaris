/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "images.nambiugandasafaris.com", // Custom domain
      },
      {
        protocol: "https",
        hostname: "pub-831b020047ea41fca8b3ec274b97d789.r2.dev", // Current R2 public URL
      },
      {
        protocol: "https",
        hostname: "**.r2.dev", // For any R2 Dev Domain
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // Cache for 1 year
  },
  reactStrictMode: false, // Disable strict mode to reduce hydration warnings
  // Suppress hydration warnings in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
