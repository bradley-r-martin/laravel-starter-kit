import { FunctionComponent } from 'react';
import AssetBustingLayout from './AssetBustingLayout';
import RequiresInstallationLayout from './RequiresInstallationLayout';
import WithToastsLayout from './WithToastsLayout';

interface BaseLayoutProps {
    children: React.ReactNode;
}

const BaseLayout: FunctionComponent<BaseLayoutProps> = (props) => {
    const { children } = props;
    return (
        <AssetBustingLayout>
            <RequiresInstallationLayout>
                <WithToastsLayout>{children}</WithToastsLayout>
            </RequiresInstallationLayout>
        </AssetBustingLayout>
    );
};

export default BaseLayout;
