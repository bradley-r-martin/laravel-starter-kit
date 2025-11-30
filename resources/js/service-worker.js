/* eslint-disable no-restricted-globals */

// This version will be replaced during build
const CACHE_VERSION = '__CACHE_VERSION__';
const CACHE_NAME = `app-cache-v${CACHE_VERSION}`;
const RUNTIME_CACHE = `app-runtime-v${CACHE_VERSION}`;
const IMAGE_CACHE = `app-images-v${CACHE_VERSION}`;

// Assets to cache on install
const PRECACHE_ASSETS = [
    '/',
    '/favicon.ico',
];

// Install event - precache assets
self.addEventListener('install', (event) => {
    // Check if there's already an active service worker (update scenario)
    // If there's no active worker, this is a first-time install
    const isFirstInstall = !self.registration.active;
    
    if (isFirstInstall) {
        console.log('[Service Worker] Installing for the first time...', CACHE_VERSION);
    }
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Check if assets are already cached
                return cache.match('/').then((cached) => {
                    const needsPrecache = !cached || isFirstInstall;
                    
                    if (needsPrecache) {
                        if (isFirstInstall) {
                            console.log('[Service Worker] Precaching assets');
                        }
                        return cache.addAll(PRECACHE_ASSETS);
                    }
                    return Promise.resolve();
                });
            })
            .then(() => {
                // Force the waiting service worker to become the active service worker
                // This allows immediate activation without waiting for all tabs to close
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Precache failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                const oldCaches = cacheNames.filter(
                    (cacheName) =>
                        cacheName !== CACHE_NAME &&
                        cacheName !== RUNTIME_CACHE &&
                        cacheName !== IMAGE_CACHE &&
                        cacheName.startsWith('app-')
                );

                const isFirstActivation = !self.registration.active;
                const hasVersionUpdate = oldCaches.length > 0;

                // Only log if this is a first activation or version update
                if (isFirstActivation || hasVersionUpdate) {
                    if (isFirstActivation) {
                        console.log('[Service Worker] Activating for the first time...', CACHE_VERSION);
                    } else {
                        console.log('[Service Worker] Activating new version...', CACHE_VERSION);
                        console.log(`[Service Worker] Cleaning up ${oldCaches.length} old cache(s)`);
                    }
                }

                return Promise.all(
                    oldCaches.map((cacheName) => {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
            })
            .then(() => {
                // Take control of all pages immediately
                return self.clients.claim();
            })
    );
});

// Helper: Check if request is for a static asset
function isStaticAsset(url) {
    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.woff', '.woff2', '.ttf', '.eot', '.ico'];
    const pathname = new URL(url, self.location.origin).pathname;
    return staticExtensions.some(ext => pathname.endsWith(ext)) || 
           pathname.startsWith('/build/assets/') ||
           pathname.startsWith('/build/manifest.json');
}

// Helper: Check if request is for an image
function isImage(url) {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];
    const pathname = new URL(url, self.location.origin).pathname;
    return imageExtensions.some(ext => pathname.endsWith(ext));
}

// Helper: Check if request is for an API call
function isApiCall(url) {
    try {
        const urlObj = new URL(url, self.location.origin);
        return urlObj.pathname.startsWith('/api/') || 
               urlObj.pathname.startsWith('/inertia/');
    } catch {
        return false;
    }
}

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== self.location.origin) {
        return;
    }

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle static assets (JS, CSS, images from build) - Cache First
    if (isStaticAsset(request.url)) {
        event.respondWith(
            caches.open(CACHE_NAME)
                .then((cache) => {
                    return cache.match(request)
                        .then((cachedResponse) => {
                            if (cachedResponse) {
                                // Return cached version, but also fetch in background to update cache
                                fetch(request)
                                    .then((networkResponse) => {
                                        if (networkResponse.ok) {
                                            cache.put(request, networkResponse.clone());
                                        }
                                    })
                                    .catch(() => {
                                        // Network fetch failed, ignore
                                    });
                                return cachedResponse;
                            }
                            
                            // Not in cache, fetch from network
                            return fetch(request)
                                .then((networkResponse) => {
                                    if (networkResponse.ok) {
                                        cache.put(request, networkResponse.clone());
                                    }
                                    return networkResponse;
                                });
                        });
                })
        );
        return;
    }

    // Handle images - Cache First with longer TTL
    if (isImage(request.url)) {
        event.respondWith(
            caches.open(IMAGE_CACHE)
                .then((cache) => {
                    return cache.match(request)
                        .then((cachedResponse) => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                            
                            return fetch(request)
                                .then((networkResponse) => {
                                    if (networkResponse.ok) {
                                        cache.put(request, networkResponse.clone());
                                    }
                                    return networkResponse;
                                });
                        });
                })
        );
        return;
    }

    // Handle API calls - Network First
    if (isApiCall(request.url)) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    // Cache successful GET responses
                    if (networkResponse.ok) {
                        const responseClone = networkResponse.clone();
                        caches.open(RUNTIME_CACHE)
                            .then((cache) => {
                                cache.put(request, responseClone);
                            });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Network failed, try cache
                    return caches.open(RUNTIME_CACHE)
                        .then((cache) => {
                            return cache.match(request)
                                .then((cachedResponse) => {
                                    return cachedResponse || new Response('Network error', { status: 408 });
                                });
                        });
                })
        );
        return;
    }

    // Handle HTML pages - Network First with cache fallback
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    // Always update cache with fresh HTML
                    if (networkResponse.ok) {
                        const responseClone = networkResponse.clone();
                        caches.open(RUNTIME_CACHE)
                            .then((cache) => {
                                cache.put(request, responseClone);
                            });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Network failed, try cache
                    return caches.open(RUNTIME_CACHE)
                        .then((cache) => {
                            return cache.match(request)
                                .then((cachedResponse) => {
                                    return cachedResponse || new Response('Offline', { 
                                        status: 503,
                                        headers: { 'Content-Type': 'text/html' }
                                    });
                                });
                        });
                })
        );
        return;
    }

    // Default: Network First for everything else
    event.respondWith(
        fetch(request)
            .then((networkResponse) => {
                if (networkResponse.ok) {
                    const responseClone = networkResponse.clone();
                    caches.open(RUNTIME_CACHE)
                        .then((cache) => {
                            cache.put(request, responseClone);
                        });
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.open(RUNTIME_CACHE)
                    .then((cache) => {
                        return cache.match(request);
                    });
            })
    );
});

// Push notification event (keep existing functionality)
self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Notification';
    const options = {
        body: data.body || '',
        icon: data.icon || '/favicon.ico',
        badge: data.badge,
        image: data.image,
        vibrate: data.vibrate,
        data: data.data,
        actions: data.actions || [],
        tag: data.tag,
        requireInteraction: data.requireInteraction || false,
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event (keep existing functionality)
self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    // Handle action clicks
    if (event.action) {
        // Custom action handling can be added here
        console.log('Action clicked:', event.action);
    }

    // Open the app when notification is clicked
    event.waitUntil(
        clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then(function (clientList) {
                // If a window is already open, focus it and navigate to notifications
                for (let i = 0; i < clientList.length; i++) {
                    const client = clientList[i];
                    if ('focus' in client) {
                        return client.focus().then(() => client.navigate('/notifications'));
                    }
                }
                // Otherwise, open a new window to notifications
                if (clients.openWindow) {
                    return clients.openWindow('/notifications');
                }
            }),
    );
});

// Notification close event (keep existing functionality)
self.addEventListener('notificationclose', function (event) {
    console.log('Notification closed:', event.notification.tag);
});

