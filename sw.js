// WhistleLogic -- offline service worker.
// Bump CACHE_NAME whenever the app is updated so old caches get cleared out.
var CACHE_NAME = 'whistlelogic-v170';
var APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
  './logo-header.png'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache){ return cache.addAll(APP_SHELL); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(key){ return key !== CACHE_NAME; })
            .map(function(key){ return caches.delete(key); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

// Stale-while-revalidate: serve instantly from cache when available (this is
// what makes the app open offline), while quietly re-fetching in the
// background so the cache stays fresh for next time. Falls back to the
// cached app shell for a navigation request when there's no network at all.
self.addEventListener('fetch', function(event){
  var req = event.request;
  if(req.method !== 'GET') return;
  // The reminder-server settings file is always read fresh from the network.
  if(req.url.indexOf('push-config.json') !== -1) return;

  event.respondWith(
    caches.match(req).then(function(cached){
      var networkFetch = fetch(req).then(function(response){
        if(response && response.status === 200){
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(req, copy); });
        }
        return response;
      }).catch(function(){
        if(cached) return cached;
        if(req.mode === 'navigate') return caches.match('./index.html');
        return undefined;
      });
      return cached || networkFetch;
    })
  );
});

// ---- Reminders (web push) ----
// The server sends an encrypted JSON message: {title, body, k: kind, url}.
// Every push must show a notification, so fall back to a plain one if the
// message can't be read.
self.addEventListener('push', function(event){
  var data = {};
  try{ data = event.data ? event.data.json() : {}; }catch(e){ data = {}; }
  var title = data.title || 'WhistleLogic';
  var options = {
    body: data.body || 'Time for a quick practice session.',
    icon: './icon-192.png',
    tag: 'whistlelogic-' + (data.k || 'reminder'),
    data: { url: data.url || './index.html#home' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var target = new URL((event.notification.data && event.notification.data.url) || './index.html#home', self.registration.scope).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list){
      for(var i = 0; i < list.length; i++){
        var c = list[i];
        if(c.url.indexOf(self.registration.scope) === 0 && 'focus' in c){
          return c.focus().then(function(w){
            if(w && 'navigate' in w){ return w.navigate(target).catch(function(){}); }
          });
        }
      }
      return self.clients.openWindow(target);
    })
  );
});
