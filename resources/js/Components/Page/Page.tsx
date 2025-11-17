import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import PageBar from './PageBar';
import PageContent from './PageContent';
import PageHeader from './PageHeader';

interface Composition {
    Bar: typeof PageBar;
    Header: typeof PageHeader;
    Content: typeof PageContent;
}

const Page: FunctionComponent<HTMLAttributes<HTMLDivElement>> & Composition = (props) => {
    const { className, ...restProps } = props;
    return (
        <div
            className={twMerge('flex flex-col space-y-8 py-5 lg:py-14', className)}
            {...restProps}
        />
    );
};

Page.Bar = PageBar;
Page.Header = PageHeader;
Page.Content = PageContent;
export default Page;
