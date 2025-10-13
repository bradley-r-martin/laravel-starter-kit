import { usePage } from '@inertiajs/react';
import { FunctionComponent, useEffect, useRef } from 'react';

interface AssetBustingLayoutProps {
    children: React.ReactNode;
}

const AssetBustingLayout: FunctionComponent<AssetBustingLayoutProps> = (props) => {
    const { children } = props;
    const { version } = usePage().props;
    const initialVersion = useRef(version);

    //  instead of relying on inertia's build in, we do out own version checking so that PWA's work correctly

    useEffect(() => {
        if (initialVersion.current !== version && version !== '') {
            alert('New version available, reloading...');
            window.location.reload();
        }
    }, [version]);

    return <>{children}</>;
};

export default AssetBustingLayout;
