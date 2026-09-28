const CACHE_NAME = 'spartiti-messa-v62-letture';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo192.png',
  './logo512.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons+Round',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'
];

// L'installazione non deve fallire se una singola risorsa esterna non e' raggiungibile
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) =>
    Promise.all(ASSETS_TO_CACHE.map((url) => cache.add(url).catch((err) => console.warn('SW: non in cache', url, err))))
  ));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.map((key) => {
    if (key !== CACHE_NAME) return caches.delete(key);
  }))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = req.url;

  // Google (login, Drive, Picker) e proxy delle letture: sempre in rete, mai dalla cache
  if (url.includes('google') || url.includes('googleapis') || url.includes('gstatic') ||
      url.includes('allorigins') || url.includes('codetabs') || url.includes('corsproxy') ||
      url.includes('lachiesa.it')) return;

  // Pagina dell'app: prima la rete (cosi' gli aggiornamenti arrivano subito), se offline la cache
  if (req.mode === 'navigate' || url.endsWith('/index.html')) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Il resto (icone, font, pdf.js): prima la cache
  e.respondWith(caches.match(req).then((r) => r || fetch(req)));
});
