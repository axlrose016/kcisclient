const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  fallbacks: {
    document: "/~offline",
    data: "/fallback.json",
    image: "/fallback.webp",
    audio: "/fallback.mp3",
    video: "/fallback.mp4",
    font: "/fallback-font.woff2",
  },
  experimental: {
    reactServerComponents: false,
  },
});

const securityHeaders = [
  // {
  //   key: "Content-Security-Policy",
  //   value: `
  //     default-src 'self';
  //     script-src https://www.google.com;
  //     style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  //     font-src 'self' https://fonts.gstatic.com;
  //     img-src 'self' data: https://api.gravserver.com https://www.w3.org/2000/svg;
  //     frame-src 'self' https://www.google.com;
  //     object-src 'none';
  //     frame-ancestors https://www.google.com 'self';
  //   `.replace(/\s{2,}/g, " ").trim(),
  // },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self';",
      "img-src 'self' data:;",
      "script-src 'self';",
      "style-src 'self' 'unsafe-inline';",
    ].join(" "),
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "no-referrer",
  },
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];

module.exports = withPWA({
  cacheHandler: require.resolve("./cache-handler.js"),
  cacheMaxMemorySize: 0,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_API_PIMS_BASE_URL: process.env.API_PIMS_BASE_URL,
    NEXT_SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
    NEXT_PUBLIC_DXCLOUD_KEY: process.env.NEXT_PUBLIC_DXCLOUD_KEY,
    NEXT_PUBLIC_DXCLOUD_URL: process.env.NEXT_PUBLIC_DXCLOUD_URL,
    JSON_SECRET_KEY: process.env.JSON_SECRET_KEY,
  },
  async rewrites() {
    return [
      {
        source: "/api-libs/:path*",
        destination: "https://dxcloud.dswd.gov.ph/api/:path*",
      },
      {
        source: "/api-kcis/:path*",
        destination: "https://kcnfms.dswd.gov.ph/kcis/api/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
});
