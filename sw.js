// sw.js
const reddofflineCache = 'app-cache-v15';
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(reddofflineCache).then((cache) => {
        return cache.addAll([
          '/',
          'index.html',
          'style.css',
          'bootstrap.css',
          'bootstrap.js',
          'script.js',
        ]);
      })
    );
  });
  
//// This must be in `service-worker.js`
//self.addEventListener("message", (event) => {
//	caches.open(reddofflineCache).then((cache) => {
//        return cache.addAll([
//			event.data,
//        ]);
//      })
//  });

  self.addEventListener("fetch", (e) => {
    if (!(e.request.url.indexOf('http') === 0)) return; 
    e.respondWith(
      (async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) {
          return r;
        }
        const response = await fetch(e.request);
        const cache = await caches.open(reddofflineCache);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
      })(),
    );
  });

  self.addEventListener('activate', async (event) => {
    clients.claim();
    console.log('Ready!');
      const existingCaches = await caches.keys();
      const invalidCaches = existingCaches.filter(c => c !== reddofflineCache);
      await Promise.all(invalidCaches.map(ic => caches.delete(ic)));
  
      // do whatever else you need to...
  
  });


