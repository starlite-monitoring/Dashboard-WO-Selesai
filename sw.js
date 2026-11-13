/* STARLITE WO Visit - service worker (aplikasi bisa di-install di HP).
   Halaman & ikon: ambil dari jaringan dulu, simpan salinan untuk dibuka saat sinyal lemah.
   Data Spreadsheet / Google / peta TIDAK disimpan di sini (selalu terbaru). */
const CACHE = 'wo-visit-v22';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;          // data Google, peta, CDN: langsung ke jaringan
  e.respondWith(fetch(e.request).then(res => {
    if (res.ok) { const salin = res.clone(); caches.open(CACHE).then(c => c.put(e.request, salin)); }
    return res;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
