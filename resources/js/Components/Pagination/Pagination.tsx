import { Paginated } from '@/Types';
import { ReloadOptions } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import {
    Pagination as MantinePagination,
    PaginationProps as MantinePaginationProps,
} from '@mantine/core';
import { FunctionComponent } from 'react';

interface PaginationProps extends Omit<MantinePaginationProps, 'total' | 'value' | 'onChange'> {
    data: Paginated<unknown>;
    attribute: string;
    options?: ReloadOptions;
}

const Pagination: FunctionComponent<PaginationProps> = (props) => {
    const { data, options = {}, attribute, ...restProps } = props;

    if (!data || data.total <= data.per_page) {
        return null;
    }

    const handleChange = (value: number) => {
        router.reload({
            only: [attribute],
            data: {
                [`${attribute}_page`]: value,
            },
            ...options,
        });
    };

    return (
        <div className="sticky bottom-22 lg:bottom-5 mb-20 ml-[50%] inline-flex -translate-x-1/2 flex-col">
            <div className="absolute inset-0 border-8 border-slate-500 blur-2xl"></div>
            <MantinePagination
                classNames={{
                    root: ' items-center *:flex-nowrap! justify-center w-auto inline-flex rounded-full bg-zinc-50 p-2 px-2 ring-1 ring-zinc-950/20 drop-shadow drop-shadow-zinc-950/10',
                }}
                size="sm"
                radius={100}
                total={data.last_page}
                value={data.current_page}
                onChange={handleChange}
                {...restProps}
            />
        </div>
    );
};

export default Pagination;
