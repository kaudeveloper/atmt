'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = [
  "assets/AssetManifest.bin",
  "assets/AssetManifest.bin.json",
  "assets/assets/fonts/arial.ttf",
  "assets/assets/fonts/arialbd.ttf",
  "assets/assets/fonts/Inter_18pt-Bold.ttf",
  "assets/assets/fonts/Inter_18pt-Regular.ttf",
  "assets/assets/fonts/Roboto-Bold.ttf",
  "assets/assets/fonts/Roboto-Regular.ttf",
  "assets/assets/fonts/times.ttf",
  "assets/assets/fonts/timesbd.ttf",
  "assets/FontManifest.json",
  "assets/fonts/MaterialIcons-Regular.otf",
  "assets/NOTICES",
  "assets/packages/cupertino_icons/assets/CupertinoIcons.ttf",
  "assets/shaders/ink_sparkle.frag",
  "assets/shaders/stretch_effect.frag",
  "canvaskit/canvaskit.js",
  "canvaskit/canvaskit.js.symbols",
  "canvaskit/canvaskit.wasm",
  "canvaskit/chromium/canvaskit.js",
  "canvaskit/chromium/canvaskit.js.symbols",
  "canvaskit/chromium/canvaskit.wasm",
  "canvaskit/skwasm.js",
  "canvaskit/skwasm.js.symbols",
  "canvaskit/skwasm.wasm",
  "canvaskit/skwasm_heavy.js",
  "canvaskit/skwasm_heavy.js.symbols",
  "canvaskit/skwasm_heavy.wasm",
  "favicon.png",
  "flutter.js",
  "flutter_bootstrap.js",
  "icons/Icon-192.png",
  "icons/Icon-512.png",
  "icons/Icon-maskable-192.png",
  "icons/Icon-maskable-512.png",
  "index.html",
  "main.dart.js",
  "manifest.json",
  "version.json"];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      try {
        return cache.addAll(RESOURCES);
      } catch (error) {
        console.error("ОШИБКА:", error.message);
      }

    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('index.html').then((response) => {
        return (
          response ||
          fetch(event.request).catch(() => caches.match('index.html'))
        );
      })
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
      );
    })
  );
});