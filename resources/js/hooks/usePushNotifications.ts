import { router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';

const applicationServerKey =
    'BMBlr6YznhYMX3NgcWIDRxZXs0sh7tCv7_YCsWcww0ZCv9WGg-tRCXfMEHTiBPCksSqeve1twlbmVAZFv7GSuj0';

export function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

interface UsePushNotificationsReturn {
    isSupported: boolean;
    isSubscribed: boolean;
    isLoading: boolean;
    subscribe: () => Promise<void>;
    unsubscribe: () => Promise<void>;
    requestPermission: () => Promise<NotificationPermission>;
}

export default function usePushNotifications(): UsePushNotificationsReturn {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check if browser supports push notifications
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsSupported(
                'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
            );
        }
    }, []);

    // Check subscription status
    useEffect(() => {
        if (!isSupported) return;

        const checkSubscription = async () => {
            try {
                const registration = await navigator.serviceWorker.getRegistration();
                if (!registration) {
                    setIsSubscribed(false);
                    return;
                }

                const subscription = await registration.pushManager.getSubscription();

                if (!subscription) {
                    setIsSubscribed(false);
                    return;
                }

                // Check if subscription exists in database
                const response = await fetch(route('push-subscriptions.check'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        endpoint: subscription.endpoint,
                    }),
                });

                const data = await response.json();
                setIsSubscribed(data.exists);
            } catch (error) {
                console.error('Error checking subscription:', error);
                setIsSubscribed(false);
            }
        };

        checkSubscription();
    }, [isSupported]);

    const requestPermission = useCallback(async () => {
        if (!isSupported) {
            throw new Error('Push notifications are not supported');
        }

        const permission = await Notification.requestPermission();
        return permission;
    }, [isSupported]);

    const subscribe = useCallback(async () => {
        if (!isSupported) {
            throw new Error('Push notifications are not supported');
        }

        setIsLoading(true);

        try {
            // Request notification permission
            const permission = await requestPermission();

            if (permission !== 'granted') {
                throw new Error('Notification permission denied');
            }

            // Register service worker
            const registration = await navigator.serviceWorker.register('/service-worker.js');

            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;

            // Check if there's an existing subscription
            let subscription = await registration.pushManager.getSubscription();

            // If no subscription exists, create a new one
            if (!subscription) {
                // Get VAPID public key from meta tag
                const vapidPublicKey = document
                    .querySelector('meta[name="vapid-public-key"]')
                    ?.getAttribute('content');

                if (!vapidPublicKey) {
                    throw new Error('VAPID public key not found');
                }

                // Subscribe to push notifications
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
                });
            }

            // Send subscription to server (will create or update)
            router.post(
                route('push-subscriptions.create'),
                {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
                        auth: arrayBufferToBase64(subscription.getKey('auth')!),
                    },
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsSubscribed(true);
                    },
                    onError: (errors) => {
                        console.error('Error saving subscription:', errors);
                        subscription?.unsubscribe();
                    },
                }
            );
        } catch (error) {
            console.error('Error subscribing to push notifications:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [isSupported, requestPermission]);

    const unsubscribe = useCallback(async () => {
        if (!isSupported) {
            throw new Error('Push notifications are not supported');
        }

        setIsLoading(true);

        try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (!registration) {
                setIsSubscribed(false);
                setIsLoading(false);
                return;
            }

            const subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
                setIsSubscribed(false);
                setIsLoading(false);
                return;
            }

            // Delete subscription from server first
            router.delete(route('push-subscriptions.delete'), {
                data: {
                    endpoint: subscription.endpoint,
                },
                preserveScroll: true,
                onSuccess: async () => {
                    // Then unsubscribe from push manager
                    try {
                        await subscription.unsubscribe();
                    } catch (error) {
                        console.error('Error unsubscribing from push manager:', error);
                    }
                    setIsSubscribed(false);
                },
                onError: (errors) => {
                    console.error('Error deleting subscription:', errors);
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            });
        } catch (error) {
            console.error('Error unsubscribing from push notifications:', error);
            setIsLoading(false);
            throw error;
        }
    }, [isSupported]);

    return {
        isSupported,
        isSubscribed,
        isLoading,
        subscribe,
        unsubscribe,
        requestPermission,
    };
}

// Helper functions

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
