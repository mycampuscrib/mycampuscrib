// MCC Service Worker - Light cache, doesn't block Firebase
const CACHE_NAME = "mcc-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(k => {
        if(k !== CACHE_NAME) return caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Don't cache Firebase, ImgBB, Firestore calls
  if(event.request.url.includes('firestore') || 
     event.request.url.includes('firebase') || 
     event.request.url.includes('imgbb') ||
     event.request.url.includes('firestore.googleapis.com')){
    return; // let network handle it
  }
  // For others, network first
  event.respondWith(fetch(event.request).catch(()=> caches.match(event.request)));
});