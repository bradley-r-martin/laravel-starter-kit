export const hasPolicy = (
    userPolicies: string[],
    policy: string | string[],
    matchAll: boolean
): boolean => {
    const policies = Array.isArray(policy) ? policy : [policy];

    if (matchAll) {
        return policies.every((p) => userPolicies.includes(p));
    }

    return policies.some((p) => userPolicies.includes(p));
};
