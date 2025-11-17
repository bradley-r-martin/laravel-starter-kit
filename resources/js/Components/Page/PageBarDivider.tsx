import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const PageBarDivider: FunctionComponent<HTMLAttributes<HTMLDivElement>> = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('h-4 w-px bg-zinc-950/20', className)} {...restProps} />;
};

export default PageBarDivider;
