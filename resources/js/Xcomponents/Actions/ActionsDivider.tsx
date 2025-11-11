import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const ActionsDivider: FunctionComponent<HTMLAttributes<HTMLDivElement>> = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('h-4 w-px bg-zinc-950/10', className)} {...restProps} />;
};

export default ActionsDivider;
