const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const moduleExports = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: '/intro',
      destination: '/home',
      permanent: true,
    },
  ],
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
};

module.exports = withSentryConfig(moduleExports, {
  silent: true,
  hideSourceMaps: true,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
});
