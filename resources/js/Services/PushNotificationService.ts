import { router } from '@inertiajs/react';

export interface PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export interface PushNotificationServiceResult<T = void> {
    success: boolean;
    data?: T;
    error?: Error | string;
}

export interface SubscriptionCheckResult {
    exists: boolean;
}

const applicationServerKey =
    'BMBlr6YznhYMX3NgcWIDRxZXs0sh7tCv7_YCsWcww0ZCv9WGg-tRCXfMEHTiBPCksSqeve1twlbmVAZFv7GSuj0';

/**
 * Service for managing push notifications
 */
class PushNotificationService {
    /**
     * Convert a URL-safe base64 string to Uint8Array
     */
    public urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; i++) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    /**
     * Convert ArrayBuffer to base64 string
     */
    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    /**
     * Get CSRF token from meta tag
     */
    private getCsrfToken(): string {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    }

    /**
     * Check if push notifications are supported by the browser
     */
    public isSupported(): Promise<PushNotificationServiceResult<boolean>> {
        return Promise.resolve({
            success: true,
            data:
                typeof window !== 'undefined' &&
                'serviceWorker' in navigator &&
                'PushManager' in window &&
                'Notification' in window,
        });
    }

    /**
     * Request notification permission from the user
     */
    public async requestPermission(): Promise<
        PushNotificationServiceResult<NotificationPermission>
    > {
        try {
            const supportedResult = await this.isSupported();

            if (!supportedResult.data) {
                return {
                    success: false,
                    error: 'Push notifications are not supported in this browser',
                };
            }

            const permission = await Notification.requestPermission();

            return {
                success: permission === 'granted',
                data: permission,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error(String(error)),
            };
        }
    }

    /**
     * Get the current notification permission status
     */
    public async getPermissionStatus(): Promise<
        PushNotificationServiceResult<NotificationPermission>
    > {
        try {
            const supportedResult = await this.isSupported();

            if (!supportedResult.data) {
                return {
                    success: false,
                    error: 'Push notifications are not supported in this browser',
                };
            }

            return {
                success: true,
                data: Notification.permission,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error(String(error)),
            };
        }
    }

    /**
     * Check if the current device has an active push subscription
     */
    public async checkSubscription(): Promise<
        PushNotificationServiceResult<SubscriptionCheckResult>
    > {
        try {
            const supportedResult = await this.isSupported();

            if (!supportedResult.data) {
                return {
                    success: false,
                    error: 'Push notifications are not supported in this browser',
                };
            }

            const registration = await navigator.serviceWorker.getRegistration();
            if (!registration) {
                return {
                    success: true,
                    data: { exists: false },
                };
            }

            const subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
                return {
                    success: true,
                    data: { exists: false },
                };
            }

            // Check if subscription exists in database
            const response = await fetch(route('push-subscriptions.check'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                },
                body: JSON.stringify({
                    endpoint: subscription.endpoint,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            return {
                success: true,
                data: { exists: data.exists },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error(String(error)),
            };
        }
    }

    /**
     * Subscribe to push notifications
     */
    public async subscribe(): Promise<PushNotificationServiceResult<PushSubscription>> {
        try {
            const supportedResult = await this.isSupported();

            if (!supportedResult.data) {
                return {
                    success: false,
                    error: 'Push notifications are not supported in this browser',
                };
            }

            // Request notification permission
            const permissionResult = await this.requestPermission();

            if (!permissionResult.success || permissionResult.data !== 'granted') {
                return {
                    success: false,
                    error: 'Notification permission denied',
                };
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
                    return {
                        success: false,
                        error: 'VAPID public key not found',
                    };
                }

                // Subscribe to push notifications
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array(applicationServerKey),
                });
            }

            // Prepare subscription data
            const subscriptionData: PushSubscription = {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
                    auth: this.arrayBufferToBase64(subscription.getKey('auth')!),
                },
            };

            // Send subscription to server
            return new Promise((resolve) => {
                router.post(route('push-subscriptions.create'), subscriptionData, {
                    preserveScroll: true,
                    onSuccess: () => {
                        resolve({
                            success: true,
                            data: subscriptionData,
                        });
                    },
                    onError: (errors) => {
                        // If server save fails, unsubscribe from push manager
                        subscription?.unsubscribe().catch(console.error);

                        resolve({
                            success: false,
                            error: new Error(
                                `Failed to save subscription: ${JSON.stringify(errors)}`
                            ),
                        });
                    },
                });
            });
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error(String(error)),
            };
        }
    }

    /**
     * Unsubscribe from push notifications
     */
    public async unsubscribe(): Promise<PushNotificationServiceResult<void>> {
        try {
            const supportedResult = await this.isSupported();

            if (!supportedResult.data) {
                return {
                    success: false,
                    error: 'Push notifications are not supported in this browser',
                };
            }

            const registration = await navigator.serviceWorker.getRegistration();
            if (!registration) {
                return {
                    success: true,
                    data: undefined,
                };
            }

            const subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
                return {
                    success: true,
                    data: undefined,
                };
            }

            // Delete subscription from server first
            return new Promise((resolve) => {
                router.delete(route('push-subscriptions.delete'), {
                    data: {
                        endpoint: subscription.endpoint,
                    },
                    preserveScroll: true,
                    onSuccess: async () => {
                        // Then unsubscribe from push manager
                        try {
                            await subscription.unsubscribe();
                            resolve({
                                success: true,
                                data: undefined,
                            });
                        } catch (error) {
                            resolve({
                                success: false,
                                error:
                                    error instanceof Error
                                        ? error
                                        : new Error('Failed to unsubscribe from push manager'),
                            });
                        }
                    },
                    onError: (errors) => {
                        resolve({
                            success: false,
                            error: new Error(
                                `Failed to delete subscription from server: ${JSON.stringify(errors)}`
                            ),
                        });
                    },
                });
            });
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error(String(error)),
            };
        }
    }

    /**
     * Get the current push subscription
     */
    public async getCurrentSubscription(): Promise<
        PushNotificationServiceResult<PushSubscription | null>
    > {
        try {
            const supportedResult = await this.isSupported();

            if (!supportedResult.data) {
                return {
                    success: false,
                    error: 'Push notifications are not supported in this browser',
                };
            }

            const registration = await navigator.serviceWorker.getRegistration();
            if (!registration) {
                return {
                    success: true,
                    data: null,
                };
            }

            const subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
                return {
                    success: true,
                    data: null,
                };
            }

            return {
                success: true,
                data: {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
                        auth: this.arrayBufferToBase64(subscription.getKey('auth')!),
                    },
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error(String(error)),
            };
        }
    }
}

// Export a singleton instance
export const pushNotificationService = new PushNotificationService();

// Also export the class for testing or custom instances
export default PushNotificationService;
