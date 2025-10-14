import usePushNotificationStatus from './usePushNotificationStatus';
import useRequestNotificationPermission from './useRequestNotificationPermission';
import useSubscribeToPushNotifications from './useSubscribeToPushNotifications';
import useUnsubscribeFromPushNotifications from './useUnsubscribeFromPushNotifications';

interface UsePushNotificationsReturn {
    isSupported: boolean;
    isSubscribed: boolean;
    isLoading: boolean;
    subscribe: () => Promise<void>;
    unsubscribe: () => Promise<void>;
    requestPermission: () => Promise<NotificationPermission>;
    isSubscribing: boolean;
    isUnsubscribing: boolean;
    isRequestingPermission: boolean;
    refetchStatus: () => Promise<void>;
}

/**
 * Convenience hook that combines all push notification hooks
 * For more granular control, use the individual hooks:
 * - usePushNotificationStatus
 * - useSubscribeToPushNotifications
 * - useUnsubscribeFromPushNotifications
 * - useRequestNotificationPermission
 */
export default function usePushNotifications(): UsePushNotificationsReturn {
    const { isSupported, isSubscribed, isLoading, refetch } = usePushNotificationStatus();
    const { subscribe, isSubscribing } = useSubscribeToPushNotifications();
    const { unsubscribe, isUnsubscribing } = useUnsubscribeFromPushNotifications();
    const { requestPermission, isRequesting: isRequestingPermission } =
        useRequestNotificationPermission();

    const handleSubscribe = async () => {
        await subscribe();
        await refetch();
    };

    const handleUnsubscribe = async () => {
        await unsubscribe();
        await refetch();
    };

    return {
        isSupported,
        isSubscribed,
        isLoading,
        subscribe: handleSubscribe,
        unsubscribe: handleUnsubscribe,
        requestPermission,
        isSubscribing,
        isUnsubscribing,
        isRequestingPermission,
        refetchStatus: refetch,
    };
}
