import InstallationNotice from '@/Components/InstallationNotice/InstallationNotice';
import { FunctionComponent } from 'react';

interface RequiresInstallationLayoutProps {
    children: React.ReactNode;
}

const RequiresInstallationLayout: FunctionComponent<RequiresInstallationLayoutProps> = (props) => {
    const { children } = props;

    const requiresInstallation = false; // isIOS() && !isStandalone();

    if (!requiresInstallation) return children;

    return <InstallationNotice />;
};

export default RequiresInstallationLayout;
