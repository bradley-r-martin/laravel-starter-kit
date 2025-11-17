import { FunctionComponent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface DescriptionListTitleProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const DescriptionListTitle: FunctionComponent<DescriptionListTitleProps> = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('select-none text-base font-semibold tracking-tight text-zinc-950/70', className)} {...restProps} />;
};

export default DescriptionListTitle;
