const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' umami.sznm.dev www.gstatic.com www.google.com apis.google.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: cdn.jsdelivr.net og.sznm.dev *.googleapis.com *.gstatic.com",
  "font-src 'self'",
  "connect-src 'self' https: wss://*.firebaseio.com wss://*.firebasedatabase.app",
  'frame-src accounts.google.com www.google.com apis.google.com',
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
] as const;

export const CSP_VALUE = CSP_DIRECTIVES.join('; ');

export const securityHeaders = {
  'Content-Security-Policy': CSP_VALUE,
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
} as const;
