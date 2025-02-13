const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    fallbacks: {
        // Failed page requests fallback to this.
        document: "/~offline",
        // This is for /_next/.../.json files.
        data: "/fallback.json",
        // This is for images.
        image: "/fallback.webp",
        // This is for audio files.
        audio: "/fallback.mp3",
        // This is for video files.
        video: "/fallback.mp4",
        // This is for fonts.
        font: "/fallback-font.woff2",
      },
      experimental: {
        reactServerComponents: false,  // Disable React Server Components if you're not using them
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
  });
  
  module.exports = withPWA({
    // Your Next.js config
  });