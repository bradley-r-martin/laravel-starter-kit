import { FunctionComponent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ActionWellRowProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const ActionWellRow: FunctionComponent<ActionWellRowProps> = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('flex gap-4 *:flex-1', className)} {...restProps} />;
};

export default ActionWellRow;
