import { usePage } from '@inertiajs/react';
import { FunctionComponent, ReactNode } from 'react';
import PolicyAllowed from './PolicyAllowed';
import PolicyDisallowed from './PolicyDisallowed';
import { hasPolicy } from './utils';

interface Composition {
    Allowed: typeof PolicyAllowed;
    Disallowed: typeof PolicyDisallowed;
}

interface PolicyProps {
    allowed?: string | string[];
    disallowed?: string | string[];
    matchAll?: boolean;
    children: ReactNode;
}

const Policy: FunctionComponent<PolicyProps> & Composition = ({
    allowed,
    disallowed,
    matchAll = true,
    children,
}) => {
    const { policies = [] } = usePage<{ policies?: string[] }>().props;

    // If both allowed and disallowed are specified, ALL conditions must be met
    if (allowed && disallowed) {
        const hasAllowedPolicies = hasPolicy(policies, allowed, matchAll);
        const hasDisallowedPolicies = hasPolicy(policies, disallowed, matchAll);

        if (hasAllowedPolicies && !hasDisallowedPolicies) {
            return <>{children}</>;
        }

        return null;
    }

    // If only allowed is specified
    if (allowed) {
        if (!hasPolicy(policies, allowed, matchAll)) {
            return null;
        }
        return <>{children}</>;
    }

    // If only disallowed is specified
    if (disallowed) {
        if (hasPolicy(policies, disallowed, matchAll)) {
            return null;
        }
        return <>{children}</>;
    }

    // If neither is specified, render children (fail-safe)
    return <>{children}</>;
};

Policy.Allowed = PolicyAllowed;
Policy.Disallowed = PolicyDisallowed;

export default Policy;
