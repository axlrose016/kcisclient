import { Configuration } from 'webpack'

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
  env: {
      NEXT_PUBLIC_API_BASE_URL: process.env.API_BASE_URL,
  },
  async headers() {
      return [
          {
              source: "/(.*)",
              headers: [
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
              ],
          },
      ];
  },
  webpack: (config: Configuration) => {
    // Use resolve.fallback to mock 'fs' for the browser
    config.resolve = {
      ...(config.resolve || {}),
      fallback: {
        fs: false, // This will mock 'fs' as 'false' in the browser environment
      },
    };

    return config;
  },
});

const nextConfig = {
  eslint: {
      ignoreDuringBuilds: true, // Correct placement for disabling ESLint
  },
};

module.exports = withPWA(nextConfig);
