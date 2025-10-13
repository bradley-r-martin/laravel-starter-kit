import Navigation from '@/Parts/Navigation';
import { FunctionComponent } from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: FunctionComponent<MainLayoutProps> = (props) => {
    const { children } = props;

    return (
        <div className="relative isolate flex max-h-screen min-h-svh w-full flex-col overflow-hidden lg:bg-zinc-100">
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
