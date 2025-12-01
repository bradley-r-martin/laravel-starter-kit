import { ReloadOptions } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import useQueryString from './useQueryString';

export default function useQueryControlReload(
    attribute: string,
    parameter: string,
    options?: ReloadOptions
) {
    const [reloading, setReloading] = useState(false);
    const defaultValue = useQueryString(`${attribute}_${parameter}`);

    const [value, setValue] = useState(defaultValue);

    const handle = (value: string) => {
        setReloading(true);
        setValue(value);
        router.reload({
            only: [attribute],
            data: {
                [`${attribute}_${parameter}`]: value,
            },
            //    preserveUrl: isStandalone(),
            ...options,
            onFinish: () => setReloading(false),
        });
    };

    return [reloading, value, handle] as const;
}
