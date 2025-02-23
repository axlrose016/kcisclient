const CACHE_NAME = "site-static-v1";
const ASSETS = [
    "/", 
    "/manifest.json",
    "/next.svg",
    "/globe.svg",
    "/window.svg"
    // "/fallback.json" will be checked dynamically before caching
];

// Function to check if a file exists before caching
async function checkAndCache(cache, url) {
    try {
        const response = await fetch(url, { method: "HEAD" });
        if (response.ok) {
            await cache.add(url);
            console.log(`✅ Cached: ${url}`);
        } else {
            console.warn(`⚠️ Skipping missing file: ${url}`);
        }
    } catch (error) {
        console.warn(`⚠️ Error checking ${url}:`, error);
    }
}

// Install event: Cache static assets safely
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            await Promise.all(ASSETS.map((url) => checkAndCache(cache, url)));
            await checkAndCache(cache, "/fallback.json"); // Check & cache fallback dynamically
        })()
    );
    self.skipWaiting();
});

// Activate event: Cleanup old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    console.log("✅ Service Worker activated, old caches removed.");
    self.clients.claim();
});

// Fetch event: Serve cached assets and dynamically cache Next.js static files
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (event.request.url.includes("custom-sw.js")) return;

    // Exclude problematic Next.js files
    if (url.pathname.includes("/_next/dynamic-css-manifest.json")) {
        console.warn("🚨 Skipping caching for:", url.pathname);
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request).catch(() => {
                if (event.request.mode === "navigate") {
                    return caches.match("/fallback.json");
                }
                return new Response("⚠️ Resource not available offline", {
                    status: 500,
                    statusText: "Offline",
                    headers: { "Content-Type": "text/plain" },
                });
            });
        })
    );
});
