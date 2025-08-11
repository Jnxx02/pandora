const CACHE_NAME = `pandora-v${Date.now()}`; // Force new cache on every deployment
const urlsToCache = [
  '/',
  '/index.html',
  // Don't cache JS/CSS files as they change between deployments
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🆕 New cache opened:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available, but don't cache JS/CSS
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip caching for API calls, dynamic content, and assets that change
  if (event.request.url.includes('/api/') || 
      event.request.method !== 'GET' ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.includes('/assets/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches aggressively
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 