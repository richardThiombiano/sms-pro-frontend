/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Headers de sécurité HTTP
  async headers() {
    return [
      {
        // Appliquer à toutes les routes
        source: '/(.*)',
        headers: [
          // Empêcher l'embedding dans des iframes (clickjacking)
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Empêcher le sniffing de MIME type
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Protection XSS (navigateurs anciens)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Contrôler les informations envoyées dans le Referer
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Forcer HTTPS (HSTS) — 1 an
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Restreindre les APIs du navigateur (caméra, micro, géoloc, etc.)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' http://localhost:8000 https://*.execute-api.eu-west-1.amazonaws.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          // Empêcher le DNS prefetching non voulu
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
