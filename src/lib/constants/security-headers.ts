export const CSP_VALUE = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' umami.sznm.dev www.gstatic.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: cdn.jsdelivr.net og.sznm.dev *.googleapis.com *.gstatic.com",
  "font-src 'self'",
  "connect-src 'self' https: wss://*.firebaseio.com wss://*.firebasedatabase.app",
  'frame-src accounts.google.com www.google.com',
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy': CSP_VALUE,
} as const;
