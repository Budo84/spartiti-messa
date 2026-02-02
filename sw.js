const CACHE_NAME = 'spartiti-messa-v23-single-file'; // Versione aggiornata
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo192.png',
  './logo512.png',
  // RIMOSSO style.css PERCHÉ NON ESISTE PIÙ
  'https://fonts.googleapis.com/icon?family=Material+Icons+Round',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
];

// Installazione e caching iniziale
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Se uno qualsiasi di questi file manca, l'installazione fallisce.
      // Ora che abbiamo tolto style.css, funzionerà.
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Attivazione e pulizia vecchie cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Gestione richieste di rete
self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  // 1. Escludi Google API e Auth dalla cache (Fondamentale per il login)
  if (url.includes('apis.google.com') || 
      url.includes('accounts.google.com') || 
      url.includes('googleapis.com')) {
    return; 
  }

  // 2. Cache First: se c'è, usala. Altrimenti scarica.
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
