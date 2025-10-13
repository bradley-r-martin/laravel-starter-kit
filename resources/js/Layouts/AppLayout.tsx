import { isMobile } from '@/Utilities/Environment';
import { FunctionComponent } from 'react';
import MainLayout from './MainLayout';
import MobileLayout from './MobileLayout';

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout: FunctionComponent<AppLayoutProps> = (props) => {
    const { children } = props;

    const Frame = isMobile() ? MobileLayout : MainLayout;

    return <Frame>{children}</Frame>;
};

export default AppLayout;
