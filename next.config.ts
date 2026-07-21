import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

import { securityHeaders } from '~/lib/constants/security-headers';

const withMDX = createMDX();

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      '@chakra-ui/react',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      '@dnd-kit/utilities',
      'react-icons',
    ],
  },
  headers: async () => [
    {
      headers: Object.entries(securityHeaders).map(([key, value]) => ({
        key,
        value,
      })),
      source: '/(.*)',
    },
  ],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  redirects: async () => [
    {
      destination: '/home',
      permanent: true,
      source: '/intro',
    },
  ],
};

export default withSentryConfig(withMDX(nextConfig), {
  silent: true,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
});
