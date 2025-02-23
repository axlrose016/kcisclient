const CACHE_NAME = "site-static-v1";
const ASSETS = [
    "/", 
    "/manifest.json",
    // Add other static assets you want to cache during installation here
];

// Install event: Cache static assets safely
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            try {
                // Cache all static assets listed in ASSETS
                await cache.addAll(ASSETS);
                console.log("Assets cached successfully!");
            } catch (error) {
                console.error("Failed to cache some assets:", error);
            }

            // Cache Google Fonts separately (workaround for CORS issues)
            try {
                const fontResponse = await fetch("https://fonts.googleapis.com/css?family=Roboto:300,400,500");
                const fontCss = await fontResponse.text();
                await cache.put("https://fonts.googleapis.com/css?family=Roboto:300,400,500", new Response(fontCss, { headers: { "Content-Type": "text/css" } }));
                console.log("Google Fonts cached successfully!");
            } catch (error) {
                console.error("Failed to cache Google Fonts:", error);
            }
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
    console.log("Service Worker activated");
    self.clients.claim();
});

// Fetch event: Serve cached assets and dynamically cache Next.js static files
self.addEventListener("fetch", (event) => {
    // Handle Next.js static files
    if (event.request.url.includes("/_next/static/")) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        cache.put(event.request, response.clone()); // Cache Next.js static files dynamically
                        return response;
                    })
                    .catch(() => caches.match(event.request)); // Serve cached version if offline
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse; // If we have a cached response, return it
                }

                // If no cached response, try to fetch the request
                return fetch(event.request).catch(() => {
                    // If fetch fails and the request mode is "navigate", serve fallback
                    if (event.request.mode === "navigate") {
                        return caches.match("/").then((fallbackResponse) => {
                            if (fallbackResponse) {
                                return fallbackResponse; // Return the fallback home page
                            } else {
                                // If the fallback is not available, return a new Response
                                return new Response("Offline fallback page", {
                                    status: 200,
                                    statusText: "OK",
                                    headers: { "Content-Type": "text/html" },
                                });
                            }
                        });
                    }

                    // If fetch fails for non-navigate requests, return a generic error message
                    return new Response("Error fetching resource", {
                        status: 500,
                        statusText: "Internal Server Error",
                        headers: { "Content-Type": "text/plain" },
                    });
                });
            })
        );
    }
});

