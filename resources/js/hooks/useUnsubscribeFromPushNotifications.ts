import { useCallback, useState } from 'react';
import { pushNotificationService } from '../Services/PushNotificationService';

interface UseUnsubscribeFromPushNotificationsReturn {
    unsubscribe: () => Promise<void>;
    isUnsubscribing: boolean;
    error: Error | string | null;
}

/**
 * Hook for unsubscribing from push notifications
 * Manages the unsubscription flow and state
 */
export default function useUnsubscribeFromPushNotifications(): UseUnsubscribeFromPushNotificationsReturn {
    const [isUnsubscribing, setIsUnsubscribing] = useState(false);
    const [error, setError] = useState<Error | string | null>(null);

    const unsubscribe = useCallback(async (): Promise<void> => {
        setIsUnsubscribing(true);
        setError(null);

        try {
            const result = await pushNotificationService.unsubscribe();

            if (!result.success) {
                const errorMessage =
                    result.error instanceof Error ? result.error.message : String(result.error);
                setError(errorMessage);
                throw new Error(errorMessage);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage);
            console.error('Error unsubscribing from push notifications:', err);
            throw err;
        } finally {
            setIsUnsubscribing(false);
        }
    }, []);

    return {
        unsubscribe,
        isUnsubscribing,
        error,
    };
}
