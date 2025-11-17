import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import PageHeaderDescription from './PageHeaderDescription';
import PageHeaderTitle from './PageHeaderTitle';

interface Composition {
    Title: typeof PageHeaderTitle;
    Description: typeof PageHeaderDescription;
}

const PageHeader: FunctionComponent<HTMLAttributes<HTMLDivElement>> & Composition = (props) => {
    const { className, ...restProps } = props;
    return <div className={twMerge('container mx-auto px-4', className)} {...restProps} />;
};
PageHeader.Title = PageHeaderTitle;
PageHeader.Description = PageHeaderDescription;

export default PageHeader;
