const CACHE_NAME = 'gym-space-cache-v1.1.0';

// Evento de instalación: crea la caché básica
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json'
      ]).catch(() => {
        // Evita que falle si algún archivo tarda en responder
        return;
      });
    })
  );
  self.skipWaiting();
});

// Evento de activación: limpia cachés antiguas si las hubiera
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Evento fetch: responde desde la caché o va a la red
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});