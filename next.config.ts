import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

import { securityHeaders } from '~/lib/constants/security-headers';

const withMDX = createMDX();

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  redirects: async () => [
    {
      source: '/intro',
      destination: '/home',
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: '/(.*)',
      headers: Object.entries(securityHeaders).map(([key, value]) => ({
        key,
        value,
      })),
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

export default withSentryConfig(withMDX(nextConfig), {
  silent: true,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
});
