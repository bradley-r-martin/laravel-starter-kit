import usePushNotifications from '@/hooks/usePushNotifications';
import { Button } from '@mantine/core';

export default function PushNotificationToggle() {
    const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();

    if (!isSupported) {
        return null;
    }

    const handleToggle = async () => {
        try {
            if (isSubscribed) {
                await unsubscribe();
            } else {
                await subscribe();
            }
        } catch (error) {
            console.error('Error toggling push notifications:', error);
        }
    };

    return (
        <Button
            onClick={handleToggle}
            disabled={isLoading}
            variant={isSubscribed ? 'outline' : 'default'}
        >
            {isLoading
                ? 'Loading...'
                : isSubscribed
                  ? 'Disable Notifications'
                  : 'Enable Notifications'}
        </Button>
    );
}
