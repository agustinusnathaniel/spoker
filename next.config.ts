import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: '/intro',
      destination: '/home',
      permanent: true,
    },
  ],
  experimental: {
    optimizePackageImports: [
      '@chakra-ui/react',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      '@dnd-kit/utilities',
      'react-icons',
    ],
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
});
