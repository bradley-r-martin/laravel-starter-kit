import InstallationNotice from '@/components/InstallationNotice/InstallationNotice';
import { isIOS, isStandalone } from '@/Utilities/Environment';
import { FunctionComponent } from 'react';

interface RequiresInstallationLayoutProps {
    children: React.ReactNode;
}

const RequiresInstallationLayout: FunctionComponent<RequiresInstallationLayoutProps> = (props) => {
    const { children } = props;

    const requiresInstallation = isIOS() && !isStandalone();

    if (!requiresInstallation) return children;

    return <InstallationNotice />;
};

export default RequiresInstallationLayout;
