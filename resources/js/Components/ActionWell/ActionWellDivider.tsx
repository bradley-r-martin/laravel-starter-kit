import { FunctionComponent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ActionWellDividerProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const ActionWellDivider: FunctionComponent<ActionWellDividerProps> = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('w-px flex-none! bg-zinc-950/10', className)} {...restProps} />;
};

export default ActionWellDivider;
