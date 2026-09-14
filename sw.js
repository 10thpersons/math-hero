// Cache the complete first chapter, including locally bundled fonts and renderer.
const CACHE_NAME = 'hero-islands-v7';
const ASSETS = [
  './', './index.html', './hero/app.js', './hero/state.js', './hero/styles.css',
  './hero/world.js', './hero/missions.js', './hero/missions.css', './hero/icon.svg',
  './hero/discovery.js', './hero/discovery.css', './hero/navigation.js', './hero/navigation.css', './hero/island-phase.css',
  './hero/learning.css', './hero/cloud.css', './hero/cloud.js', './hero/grade-banks.js', './hero/quiz.js', './hero/quiz.css', './hero/expansion.css',
  './data/d1-bm.json', './data/d1-bi.json', './data/d3-bm.json', './data/d3-bi.json',
  './hero/vendor/three.module.js', './hero/vendor/three.core.js',
  './hero/fonts/fredoka.ttf', './hero/fonts/nunito.ttf',
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)));
    }
    return response;
  }).catch(async () => {
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(event.request) || await caches.match(event.request) || Response.error();
  }));
});
