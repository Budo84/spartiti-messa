const CACHE_NAME = 'spartiti-messa-ultimate-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  'https://fonts.googleapis.com/icon?family=Material+Icons+Round',
  'https://apis.google.com/js/api.js',
  'https://accounts.google.com/gsi/client'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
      }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((response) => response || fetch(e.request)));
});
