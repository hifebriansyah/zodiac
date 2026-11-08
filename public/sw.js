// The folder the site is served from ("/" or "/for-fun/zodiac/"): the worker's own scope.
const BASE = new URL(self.registration.scope).pathname;
const CACHE_NAME = 'astraea-editorial-v1';
const API_CACHE_NAME = 'astraea-api-readings-v1';
const STATIC_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.webmanifest',
  BASE + 'favicon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== API_CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Cache API readings from zodiac-worker.situs.id for offline habit loop
  if (url.hostname.includes('zodiac-worker.situs.id') || url.pathname.startsWith('/reading/')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          const cachedResponse = await cache.match(request);
          if (cachedResponse) return cachedResponse;
          throw err;
        }
      })
    );
    return;
  }

  // Stale-while-revalidate for app shell & assets
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached || caches.match(BASE + 'index.html'));

      return cached || networkFetch;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_MORNING_NOTIFICATION') {
    const { signName, headline, luckyColor, vibeScore } = event.data.payload || {};
    self.registration.showNotification(
      `07:00 AM Cosmic Briefing • ${signName || 'ASTRAEA'}`,
      {
        body: `${headline || 'Your daily planetary alignment is ready.'} (Vibe ${vibeScore || 9}/10 • Lucky Color: ${luckyColor || 'Gold'})`,
        icon: BASE + 'favicon.svg',
        badge: BASE + 'favicon.svg',
        tag: 'astraea-daily-7am',
        data: { url: event.data.payload?.url || BASE },
      }
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || BASE;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
