import { FunctionComponent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface DescriptionListItemsProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const DescriptionListItems: FunctionComponent<DescriptionListItemsProps> = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('divide-y divide-zinc-950/10 text-sm *:py-3', className)} {...restProps} />;
};

export default DescriptionListItems;
