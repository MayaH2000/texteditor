const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);


// Implement asset caching
registerRoute(
  // Match assets with a regular expression
  ({ request }) => request.destination === 'style' || request.destination === 'script' || request.destination === 'image',
  // Use CacheFirst strategy for assets
  new CacheFirst({
    // Use a different cache name for assets
    cacheName: 'asset-cache',
    plugins: [
      // Cache only successful responses (status 200)
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      // Set an expiration for cached assets
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);