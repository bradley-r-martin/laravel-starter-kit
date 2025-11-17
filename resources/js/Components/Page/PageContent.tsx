import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import PageContentAside from './PageContentAside';
import PageContentMain from './PageContentMain';

interface Composition {
    Main: typeof PageContentMain;
    Aside: typeof PageContentAside;
}

interface PageContentProps extends HTMLAttributes<HTMLDivElement> {
    split?: boolean;
}

const PageContent: FunctionComponent<PageContentProps> & Composition = (props) => {
    const { className, split, ...restProps } = props;
    return (
        <div
            className={twMerge(
                'container mx-auto flex flex-col-reverse items-stretch divide-x divide-zinc-200 px-4 lg:flex-row',
                split ? '*:first:pr-8 *:last:pl-8' : '',
                className
            )}
            {...restProps}
        />
    );
};

PageContent.Main = PageContentMain;
PageContent.Aside = PageContentAside;

export default PageContent;
