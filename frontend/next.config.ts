import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    // PostHog needs these rewrites to route client-side SDK calls
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.posthog.com/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.posthog.com/decide',
      },
    ];
  },
};

export default nextConfig;
