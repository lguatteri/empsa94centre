const CACHE = 'empsa-v7';
const ASSETS = [
  './',
  './empsa.html',
  './manifest.webmanifest',
  './icon.svg',
  './logo-empsa.png',
  './logo-empsa-white.png',
  './logo-aphp.png',
  './logo-dmu.png',
  './logo-hmn.png',
  './fonts/montserrat-400.woff2',
  './fonts/montserrat-500.woff2',
  './fonts/montserrat-600.woff2',
  './fonts/montserrat-700.woff2',
  './fonts/open-sans-400.woff2',
  './fonts/open-sans-500.woff2',
  './fonts/open-sans-600.woff2',
  './fonts/open-sans-700.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && new URL(req.url).origin === self.location.origin) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
        }
        return res;
      }).catch(() => {
        if (req.mode === 'navigate') return caches.match('./empsa.html');
      });
    })
  );
});
