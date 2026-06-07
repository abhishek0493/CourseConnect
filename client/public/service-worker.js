/*
 * Self-unregistering service worker.
 *
 * The previous Create-React-App build registered a precaching service worker.
 * Returning users on the same origin would otherwise keep being served stale,
 * cached assets even after this deploy. This no-op worker takes control,
 * deletes all caches, unregisters itself, and reloads open tabs so everyone
 * lands on the fresh build. The new Vite app does NOT register any worker.
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
        await self.registration.unregister();
        const clients = await self.clients.matchAll({ type: 'window' });
        clients.forEach((client) => client.navigate(client.url));
      } catch (e) {
        // best-effort cleanup
      }
    })()
  );
});
