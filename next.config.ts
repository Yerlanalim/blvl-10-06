import type { NextConfig } from "next";
// @ts-ignore - Bundle analyzer is optional
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Moved from experimental - Next.js 15 compatibility
  serverExternalPackages: ['@supabase/ssr', '@google-cloud/vertexai'],
  
  experimental: {
    // Next.js 15 compatible experimental features only
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Image optimization settings
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Enhanced security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Webpack configuration optimized for Next.js 15
  webpack: (config, { dev, isServer }) => {
    // Production optimizations only (enhanced for fix6.5.2)
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 200000, // 200KB max chunk size
          cacheGroups: {
            // Core libraries
            supabase: {
              test: /[\\/]node_modules[\\/](@supabase|supabase)/,
              name: 'supabase',
              chunks: 'all',
              priority: 20,
            },
            // AI libraries (heavy components)
            ai: {
              test: /[\\/](lib[\\/]ai|@google-cloud|vertexai)/,
              name: 'ai-vendor',
              chunks: 'all',
              priority: 19,
            },
            // Admin features (lazy loaded)
            admin: {
              test: /[\\/](admin|analytics)/,
              name: 'admin',
              chunks: 'async',
              priority: 18,
            },
            // UI components
            ui: {
              test: /[\\/]components[\\/]ui[\\/]/,
              name: 'ui-components',
              chunks: 'all',
              priority: 15,
            },
            // Other vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              minChunks: 2,
            },
          },
        },
      }
    }

    // Development - let Next.js handle devtool automatically
    if (dev) {
      // Don't override devtool - let Next.js optimize it
      // Only set minimal stats to reduce header size
      config.stats = 'errors-warnings'
      
      // Reduce error verbosity to prevent HTTP 431
      config.optimization = {
        ...config.optimization,
        emitOnErrors: false,
      }
    }

    return config
  },
  
  // Compression and optimization - Next.js 15 defaults
  compress: true,
  
  // Output configuration
  output: 'standalone',
};

export default withBundleAnalyzer(nextConfig);
