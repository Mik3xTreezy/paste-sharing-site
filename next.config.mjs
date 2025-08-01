/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Suppress hydration warnings in development
  reactStrictMode: true,
  experimental: {
    // This helps with hydration issues
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
