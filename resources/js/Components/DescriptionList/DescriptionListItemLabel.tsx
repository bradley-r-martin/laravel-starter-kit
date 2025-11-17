import { FunctionComponent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface DescriptionListItemLabelProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const DescriptionListItemLabel: FunctionComponent<DescriptionListItemLabelProps> = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('w-32 shrink-0 select-none truncate font-semibold tracking-tight text-zinc-950/60', className)} {...restProps} />;
};

export default DescriptionListItemLabel;
