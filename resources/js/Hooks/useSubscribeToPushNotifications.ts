import { useCallback, useState } from 'react';
import {
    pushNotificationService,
    type PushSubscription,
} from '../Services/PushNotificationService';

interface UseSubscribeToPushNotificationsReturn {
    subscribe: () => Promise<PushSubscription>;
    isSubscribing: boolean;
    subscription: PushSubscription | null;
    error: Error | string | null;
}

/**
 * Hook for subscribing to push notifications
 * Manages the subscription flow and state
 */
export default function useSubscribeToPushNotifications(): UseSubscribeToPushNotificationsReturn {
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [error, setError] = useState<Error | string | null>(null);

    const subscribe = useCallback(async (): Promise<PushSubscription> => {
        setIsSubscribing(true);
        setError(null);

        try {
            const result = await pushNotificationService.subscribe();

            if (!result.success || !result.data) {
                const errorMessage =
                    result.error instanceof Error ? result.error.message : String(result.error);
                setError(errorMessage);
                throw new Error(errorMessage);
            }

            setSubscription(result.data);
            return result.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage);
            console.error('Error subscribing to push notifications:', err);
            throw err;
        } finally {
            setIsSubscribing(false);
        }
    }, []);

    return {
        subscribe,
        isSubscribing,
        subscription,
        error,
    };
}
