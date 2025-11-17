import { FunctionComponent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageContentAsideProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const PageContentAside: FunctionComponent<PageContentAsideProps> = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('flex flex-col space-y-6 lg:w-96', className)} {...restProps} />;
};

export default PageContentAside;
