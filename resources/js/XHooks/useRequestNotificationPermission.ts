import { useCallback, useState } from 'react';
import { pushNotificationService } from '../Services/PushNotificationService';

interface UseRequestNotificationPermissionReturn {
    requestPermission: () => Promise<NotificationPermission>;
    isRequesting: boolean;
    permission: NotificationPermission | null;
    error: Error | string | null;
}

/**
 * Hook for requesting notification permission
 * Manages the permission request flow and state
 */
export default function useRequestNotificationPermission(): UseRequestNotificationPermissionReturn {
    const [isRequesting, setIsRequesting] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission | null>(null);
    const [error, setError] = useState<Error | string | null>(null);

    const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
        setIsRequesting(true);
        setError(null);

        try {
            const result = await pushNotificationService.requestPermission();

            if (!result.success || !result.data) {
                const errorMessage =
                    result.error instanceof Error ? result.error.message : String(result.error);
                setError(errorMessage);
                throw new Error(errorMessage);
            }

            setPermission(result.data);
            return result.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage);
            throw err;
        } finally {
            setIsRequesting(false);
        }
    }, []);

    return {
        requestPermission,
        isRequesting,
        permission,
        error,
    };
}
