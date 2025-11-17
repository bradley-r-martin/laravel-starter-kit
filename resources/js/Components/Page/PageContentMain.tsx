import { FunctionComponent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageContentMainProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const PageContentMain: FunctionComponent<PageContentMainProps> = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('flex-1 space-y-10', className)} {...restProps} />;
};

export default PageContentMain;
