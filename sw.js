const CACHE_NAME = 'spartiti-messa-v18-fix-drive';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo192.png',
  './logo512.png',
  // Se hai un file css separato lascialo, se il CSS è dentro l'HTML togli questa riga:
  'https://fonts.googleapis.com/icon?family=Material+Icons+Round',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
];

// Installazione e caching iniziale
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
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

  // 1. IMPORTANTE: Escludi Google API e Auth dalla cache
  // Questo risolve i problemi di login e Drive su smartphone
  if (url.includes('apis.google.com') || 
      url.includes('accounts.google.com') || 
      url.includes('googleapis.com')) {
    return; // Lascia che il browser gestisca la rete normalmente
  }

  // 2. Per tutto il resto, usa la Cache se disponibile, altrimenti Rete
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request).catch(() => {
        // Se sei offline e la risorsa non è in cache, non fare nulla (o gestisci errore)
        // Questo evita blocchi su file non essenziali
      });
    })
  );
});
