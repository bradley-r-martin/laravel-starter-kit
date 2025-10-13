import { usePage } from '@inertiajs/react';
import { Notifications, notifications } from '@mantine/notifications';
import { FunctionComponent, useEffect } from 'react';

interface WithToastsLayoutProps {
    children: React.ReactNode;
}

const WithToastsLayout: FunctionComponent<WithToastsLayoutProps> = (props) => {
    const { children } = props;

    const { toast } = usePage<{ toast: { message: string; type: string } }>().props;

    useEffect(() => {
        if (toast?.message) {
            notifications.show({
                title: toast.type === 'success' ? 'Success' : 'Notice',
                message: toast.message,
                color: toast.type === 'success' ? 'green' : toast.type === 'error' ? 'red' : 'blue',
            });
        }
    }, [toast]);
    return (
        <>
            <Notifications position="top-right" />
            {children}
        </>
    );
};

export default WithToastsLayout;
