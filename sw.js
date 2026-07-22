const CACHE_NAME = "lit-based-proposal-builder-v4.8.2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles-upload.css?v=20260722-v482-offline",
  "./app-upload.js?v=20260722-v482-offline",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./jszip.min.js",
  "./pdf.min.mjs",
  "./pdf.worker.min.mjs",
  "./erb-templates/adult-consent.docx",
  "./erb-templates/child-assent.docx",
  "./erb-templates/parent-permission.docx",
  "./erb-templates/two-representative-permission.docx"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith("lit-based-proposal-builder-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // The update check must reach the network so a cached release file cannot hide a new version.
  if (url.pathname.endsWith("/version.json")) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cached) => cached || fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request, { ignoreSearch: true })))
  );
});
