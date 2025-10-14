/* eslint-disable no-restricted-globals */
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
                // If a window is already open, focus it
                for (let i = 0; i < clientList.length; i++) {
                    const client = clientList[i];
                    if ('focus' in client) {
                        return client.focus();
                    }
                }
                // Otherwise, open a new window
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            }),
    );
});

self.addEventListener('notificationclose', function (event) {
    console.log('Notification closed:', event.notification.tag);
});

