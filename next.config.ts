import type {NextConfig} from 'next';

// ─── Security headers ─────────────────────────────────────────────────────────
const securityHeaders = [
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Prevent MIME sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Referrer policy
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Restrict browser features
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // HSTS (1 year, include subdomains)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  // XSS protection (legacy browsers)
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // CSP in report-only mode — tune and switch to Content-Security-Policy when ready
  {
    key: 'Content-Security-Policy-Report-Only',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
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
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // ─── Security headers on all routes ────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // Long-lived cache for static assets
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|webp|avif|svg|woff2|woff|ttf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  // ─── Reduce bundle size by tree-shaking large packages ─────────────────────
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'three'],
  },
  // ─── Image optimisation ────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,        // 1-year browser cache for optimised images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos',            port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images.higgs.ai',          port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'd8j0ntlcm91z4.cloudfront.net', port: '', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'fast-and-furious-output-prod-20250325165756275300000001.s3.eu-north-1.amazonaws.com',
        port: '', pathname: '/**',
      },
      { protocol: 'https', hostname: 'images.unsplash.com',      port: '', pathname: '/**' },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = { ignored: /.*/ };
    }
    return config;
  },
};

export default nextConfig;
