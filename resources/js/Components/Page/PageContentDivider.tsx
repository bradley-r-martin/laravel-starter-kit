import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const PageContentDivider: FunctionComponent<Omit<HTMLAttributes<HTMLDivElement>, 'children'>> = (
    props
) => {
    const { className, ...restProps } = props;
    return (
        <div
            aria-hidden="true"
            className={twMerge(
                'my-8 flex h-px w-full shrink-0 bg-zinc-950/10 lg:mx-8 lg:my-0 lg:h-auto lg:w-px',
                className
            )}
            {...restProps}
        />
    );
};

export default PageContentDivider;
