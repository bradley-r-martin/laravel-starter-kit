import { FunctionComponent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface DescriptionListItemValueProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const DescriptionListItemValue: FunctionComponent<DescriptionListItemValueProps> = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('flex-1 truncate text-zinc-950/50', className)} {...restProps} />;
};

export default DescriptionListItemValue;
