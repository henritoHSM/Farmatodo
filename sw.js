const CACHE_NAME = 'farmatodo-v2';
const urlsToCache = [
    '/Farmatodo/',
    '/Farmatodo/index.html',
    '/Farmatodo/styles.css',
    '/Farmatodo/app.js',
    '/Farmatodo/medicamentos.json'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
