const CACHE_NAME = 'divine-liturgy-cache-v5';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/script.js',
  './js/prayers.js',
  './js/songs.js',
  './js/servants.js',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './bible/NKJV_New_King_James_English_Bible_1982AD.json',
  './bible/አም54_Haile_Selassie_Amharic_Bible_1962AD_1954EC.json',
  './bible/RGV_Reina_Valera_Gomez_Bible_2010AD.json',
  './bible/ግእዝ_Psalms_1-151_with_Songs_of_the_Prophets.json',
  './bible/COPTIC2025_Psalms_Bohairic_Coptic_Scriptorium_Corpora_2025.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use cache.addAll and wrap in a try-catch or handle individual failures if preferred.
        // For now, we'll stick to addAll but ensure paths are correct.
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Fix: Only cache GET requests. Firebase uses POST for many operations.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // If we got a valid response, update the cache
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(error => {
          console.error('Fetch failed: ', error);
        });

        // Return the cached response if it exists, otherwise wait for the network
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
