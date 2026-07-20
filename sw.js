// Math Hero Service Worker — offline cache for game assets
const CACHE_NAME = 'math-hero-v1';
const ASSETS = [
  './',
  './index.html',
  './data/bodies.js',
  './data/items.js',
];

// Dynamically cache all item PNGs on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Cache-first strategy for images, network-first for HTML/JS
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache-first for PNG assets
  if (url.pathname.endsWith('.png')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }
  
  // Network-first for HTML/JS/data
  event.respondWith(
    fetch(event.request).then((response) => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      return response;
    }).catch(() => caches.match(event.request))
  );
});

// Clean old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      );
    })
  );
  self.clients.claim();
});
