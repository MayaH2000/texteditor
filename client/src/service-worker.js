// Define the name for your cache
const CACHE_NAME = 'my-cache';
import { precacheAndRoute } from 'workbox-precaching';

// List of files to precache
precacheAndRoute(self.__WB_MANIFEST || []);

// Define an array of URLs to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/main.bundle.js',
  '/install.bundle.js',
  // Add other URLs to cache here
];

// Install event listener
self.addEventListener('install', event => {
  // Perform installation steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event listener
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        // Make network request and cache it if successful
        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Open the cache and put the new response in cache
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});
