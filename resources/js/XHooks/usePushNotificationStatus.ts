import { useEffect, useState } from 'react';
import { pushNotificationService } from '../Services/PushNotificationService';

interface UsePushNotificationStatusReturn {
    isSupported: boolean;
    isSubscribed: boolean;
    isLoading: boolean;
    refetch: () => Promise<void>;
}

/**
 * Hook for tracking push notification status
 * Provides the current state of push notification support and subscription
 */
export default function usePushNotificationStatus(): UsePushNotificationStatusReturn {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkStatus = async () => {
        setIsLoading(true);

        // Check support
        const supportResult = await pushNotificationService.isSupported();
        if (supportResult.success && supportResult.data !== undefined) {
            setIsSupported(supportResult.data);

            // Only check subscription if supported
            if (supportResult.data) {
                const subscriptionResult = await pushNotificationService.checkSubscription();

                if (subscriptionResult.success && subscriptionResult.data) {
                    setIsSubscribed(subscriptionResult.data.exists);
                } else {
                    console.error('Error checking subscription:', subscriptionResult.error);
                    setIsSubscribed(false);
                }
            }
        }

        setIsLoading(false);
    };

    useEffect(() => {
        checkStatus();
    }, []);

    return {
        isSupported,
        isSubscribed,
        isLoading,
        refetch: checkStatus,
    };
}
