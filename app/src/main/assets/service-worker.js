const CACHE_NAME = 'divine-liturgy-cache-v37';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css?v=32',
  './js/icons.js?v=10',
  './js/prayers.js?v=10',
  './js/songs.js?v=10',
  './js/servants.js?v=10',
  './js/kidase.js?v=11',
  './js/teklil.js?v=2',
  './js/typical_psalms.js?v=3',
  './js/st_athanasius_psalms.js?v=2',
  './js/bible_service.js?v=2',
  './js/miracles_of_mary.js',
  './js/script.js?v=40',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './bible/ግእዝ_Psalms_1-151_with_Songs_of_the_Prophets.json'
];

self.addEventListener('install', event => {
  // Force the new service worker to activate immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Only cache GET requests. Firebase uses POST for many operations.
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  const isHtmlOrRoot = event.request.mode === 'navigate' ||
    url.pathname === '/' ||
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('/index.html') ||
    !url.pathname.includes('.');

  if (isHtmlOrRoot) {
    // Network-First for HTML/navigation requests:
    // Ensures users always receive the latest index.html and version tags when online,
    // while seamlessly falling back to cached index.html when offline.
    event.respondWith(
      fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith('http')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(event.request, { ignoreSearch: true });
      })
    );
    return;
  }

  // Immutable Cache-First for static Bible JSON files to avoid cloning multi-MB buffers on every hit
  const isBibleJson = url.pathname.includes('/bible/') && url.pathname.endsWith('.json');
  if (isBibleJson) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith('http')) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Cache-First with Network Update for versioned static assets (JS, CSS, images)
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith('http')) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(error => {
          console.error('Fetch failed for url ' + event.request.url + ':', error);
          throw error;
        });

        return response || fetchPromise;
      });
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Force the new service worker to take control immediately
      return self.clients.claim();
    })
  );
});

// Skip waiting to ensure the new service worker activates immediately after installation
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
