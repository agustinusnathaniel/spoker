// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import {
  captureConsoleIntegration,
  init,
  replayIntegration,
} from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const { APP_ENV } = process.env;

const isLocal = process.env.NODE_ENV === 'development';

if (!isLocal) {
  init({
    dsn: SENTRY_DSN,
    environment: APP_ENV,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
    integrations: [
      replayIntegration(),
      captureConsoleIntegration({ levels: ['error', 'fatal'] }),
    ],
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
  });
}
