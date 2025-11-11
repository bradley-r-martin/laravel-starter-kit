import useQueryControlReload from '@/XHooks/useQueryControlReload';
import { ReloadOptions } from '@inertiajs/core';

import { Loader, SegmentedControl, SegmentedControlProps } from '@mantine/core';
import { FunctionComponent } from 'react';

interface Option {
    value: string;
    label: string;
}

interface StatusControlProps
    extends Omit<SegmentedControlProps, 'data' | 'defaultValue' | 'onChange'> {
    attribute: string;
    data: Option[];
    options?: ReloadOptions;
}

const StatusControl: FunctionComponent<StatusControlProps> = (props) => {
    const { data, options, attribute, ...restProps } = props;

    const [reloading, value, handle] = useQueryControlReload(attribute, 'status', options);

    return (
        <SegmentedControl
            data={data.map((item) => ({
                ...item,
                label: (
                    <span>
                        <span
                            data-loading={reloading && item.value === value}
                            className="data-[loading=true]:opacity-0"
                        >
                            {item.label}
                        </span>
                        {reloading && item.value === value ? (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <Loader size={10} color="zinc" />
                            </span>
                        ) : null}
                    </span>
                ),
            }))}
            fullWidth
            defaultValue={value}
            onChange={handle}
            {...restProps}
        />
    );
};

export default StatusControl;
