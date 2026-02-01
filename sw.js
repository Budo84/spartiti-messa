const CACHE_NAME = 'spartiti-messa-v20-direct-auth';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo192.png',
  './logo512.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons+Round',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
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
  const url = e.request.url;
  // REGOLE CRITICHE PER IL LOGIN GOOGLE SU MOBILE:
  // Se la richiesta è verso Google, vai SEMPRE diretto in rete (niente cache)
  if (url.includes('google') || url.includes('googleapis') || url.includes('gstatic')) {
    return; 
  }
  
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
