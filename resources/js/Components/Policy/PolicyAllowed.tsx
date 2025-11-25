import { usePage } from '@inertiajs/react';
import { FunctionComponent, ReactNode } from 'react';
import { hasPolicy } from './utils';

interface PolicyAllowedProps {
    policy: string | string[];
    matchAll?: boolean;
    children: ReactNode;
}

const PolicyAllowed: FunctionComponent<PolicyAllowedProps> = ({
    policy,
    matchAll = false,
    children,
}) => {
    const { policies = [] } = usePage<{ policies?: string[] }>().props;

    if (!hasPolicy(policies, policy, matchAll)) {
        return null;
    }

    return <>{children}</>;
};

export default PolicyAllowed;
