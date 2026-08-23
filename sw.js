// ═════════════════════════════════════════════════════════════════════
// SERVICE WORKER — SHAPES BY SATIINDER KAUR PWA ENGINE
// Stale-While-Revalidate Offline Caching & Background App Shell
// ═════════════════════════════════════════════════════════════════════

const CACHE_NAME = "shapes-pwa-v47.0";
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/index.css",
  "/index.js",
  "/appointment.html",
  "/sizequiz.html",
  "/lookbook.html",
  "/track.html",
  "/account.html",
  "/info.html",
  "/manifest.json",
  "/images/app_icon.png",
  "/images/hero_coord_editorial.webp",
  "/images/welcome_coord_luxury.webp"
];

// Install: Pre-cache App Shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[PWA Service Worker] Pre-caching core app shell");
      return cache.addAll(PRECACHE_ASSETS).catch((e) => console.warn("Pre-cache asset note:", e));
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache buckets
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[PWA Service Worker] Purging stale cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate strategy for optimal speed
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET and API / Razorpay requests
  if (req.method !== "GET" || url.pathname.startsWith("/api/") || url.hostname.includes("razorpay.com")) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(req);

      const fetchPromise = fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          // Cache successful responses for images, fonts, scripts, and pages
          if (url.origin === location.origin || url.hostname.includes("fonts.g")) {
            cache.put(req, networkResponse.clone());
          }
        }
        return networkResponse;
      }).catch(() => {
        // Offline Fallback for HTML navigation
        if (req.mode === "navigate") {
          return cache.match("/index.html");
        }
        return cachedResponse;
      });

      // Return cached response instantly if present, otherwise await network
      return cachedResponse || fetchPromise;
    })
  );
});