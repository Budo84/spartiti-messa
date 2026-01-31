const CACHE_NAME = 'spartiti-messa-v21';


const ASSETS = [
'./',
'./index.html',
'./manifest.json',
'./logo192.png',
'./logo512.png',
'https://fonts.googleapis.com/icon?family=Material+Icons+Round',
'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];


self.addEventListener('install', (e) => {
self.skipWaiting();
e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});


self.addEventListener('activate', (e) => {
e.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.map(k => k!==CACHE_NAME && caches.delete(k)))
)
);
self.clients.claim();
});


self.addEventListener('fetch', (e) => {
// ⚠️ NON cache Google API
if(e.request.url.includes('googleapis.com') || e.request.url.includes('accounts.google.com')){
return;
}
e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
