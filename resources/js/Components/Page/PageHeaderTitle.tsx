import { FunctionComponent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageHeaderTitleProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const PageHeaderTitle: FunctionComponent<PageHeaderTitleProps> = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('text-2xl font-semibold text-zinc-950/70', className)} {...restProps} />;
};

export default PageHeaderTitle;
