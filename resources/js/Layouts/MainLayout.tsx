import Navigation from '@/Parts/Navigation';
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
        <div className="relative isolate flex max-h-screen min-h-svh w-full flex-col overflow-hidden lg:bg-zinc-100">
            <Notifications position="top-right" />
            <div className="">
                <Navigation />
            </div>
            <main
                scroll-region=""
                className="relative flex flex-1 flex-col overflow-auto bg-zinc-50 lg:m-3 lg:mt-px lg:rounded-lg lg:bg-white lg:shadow-xs lg:ring-1 lg:ring-zinc-950/10"
            >
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
