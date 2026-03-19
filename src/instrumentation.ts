import { captureConsoleIntegration, init } from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const APP_ENV = process.env.APP_ENV;

export function register() {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: APP_ENV,
      integrations: [captureConsoleIntegration()],
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: APP_ENV,
    });
  }
}
