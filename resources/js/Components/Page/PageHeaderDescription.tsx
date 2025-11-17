import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const PageHeaderDescription: FunctionComponent<HTMLAttributes<HTMLDivElement>> = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('text-sm text-zinc-950/50', className)} {...restProps} />;
};

export default PageHeaderDescription;
