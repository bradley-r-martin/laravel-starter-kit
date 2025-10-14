import ContentContext from '@/contexts/ContentContext';
import Navigation from '@/Parts/Navigation';
import { FunctionComponent, useRef } from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: FunctionComponent<MainLayoutProps> = (props) => {
    const { children } = props;
    const ref = useRef<HTMLDivElement>(null);
    return (
        <ContentContext.Provider
            value={{
                ref: ref as React.RefObject<HTMLDivElement>,
                opened: false,
                open: () => {},
                close: () => {},
            }}
        >
            <div className="relative isolate flex max-h-screen min-h-svh w-full flex-col overflow-hidden lg:bg-zinc-100">
                <div className="">
                    <Navigation />
                </div>
                <main
                    ref={ref}
                    scroll-region=""
                    className="relative flex-1 overflow-auto bg-zinc-50 lg:m-3 lg:mt-px lg:rounded-lg lg:bg-white lg:shadow-xs lg:ring-1 lg:ring-zinc-950/10"
                >
                    {children}
                </main>
            </div>
        </ContentContext.Provider>
    );
};

export default MainLayout;
