const FILES_TO_CACHE = [

];
const APP_PREFIX = 'Budgy-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// cache resources
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});