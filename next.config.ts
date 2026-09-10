import type { NextConfig } from 'next';

// ─── Security headers ─────────────────────────────────────────────────────────
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  {
    key: 'Content-Security-Policy-Report-Only',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "img-src 'self' data: blob: https://images.unsplash.com https://picsum.photos https://i.postimg.cc https://images.higgs.ai https://d8j0ntlcm91z4.cloudfront.net https://fast-and-furious-output-prod-20250325165756275300000001.s3.eu-north-1.amazonaws.com",
      "connect-src 'self' https://api.postcodes.io https://generativelanguage.googleapis.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ── Performance ─────────────────────────────────────────────────────────────
  compress: true,               // gzip/brotli compression on server responses
  poweredByHeader: false,       // removes X-Powered-By header (tiny payload saving)
  generateEtags: true,          // enables ETag for conditional requests

  // ── Build ────────────────────────────────────────────────────────────────────
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },

  // ── Security headers on all routes ────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // Long-lived cache for static assets (fonts are now self-hosted via next/font)
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|webp|avif|svg|woff2|woff|ttf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // ── Package tree-shaking ────────────────────────────────────────────────────
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'three',
      '@tabler/icons-react',
      'recharts',
    ],
  },

  // ── Image optimisation ─────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'images.higgs.ai', pathname: '/**' },
      { protocol: 'https', hostname: 'd8j0ntlcm91z4.cloudfront.net', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'fast-and-furious-output-prod-20250325165756275300000001.s3.eu-north-1.amazonaws.com',
        pathname: '/**',
      },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },

  output: 'standalone',
  transpilePackages: ['motion'],

  // ── Webpack: split large packages into separate async chunks ───────────────
  webpack: (config, { dev, isServer }) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = { ignored: /.*/ };
    }

    // In production client builds, split heavy libraries into named chunks
    // so they can be cached independently and loaded on demand
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...(config.optimization?.splitChunks as object || {}),
          cacheGroups: {
            ...((config.optimization?.splitChunks as { cacheGroups?: object })?.cacheGroups || {}),
            framerMotion: {
              test: /[\\/]node_modules[\\/](framer-motion|motion)[\\/]/,
              name: 'framer-motion',
              chunks: 'async' as const,
              priority: 20,
            },
            three: {
              test: /[\\/]node_modules[\\/](three)[\\/]/,
              name: 'three',
              chunks: 'async' as const,
              priority: 20,
            },
            recharts: {
              test: /[\\/]node_modules[\\/](recharts|d3-.*)[\\/]/,
              name: 'recharts',
              chunks: 'async' as const,
              priority: 20,
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
