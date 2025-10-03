import { usePage } from '@inertiajs/react';
import { Notifications, notifications } from '@mantine/notifications';
import { FunctionComponent, useEffect } from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: FunctionComponent<MainLayoutProps> = (props) => {
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
        <div>
            <Notifications position="top-right" />
            <h1>Application</h1>
            {children}
        </div>
    );
};

export default MainLayout;
