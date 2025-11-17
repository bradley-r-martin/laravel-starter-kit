import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import PageBarDivider from './PageBarDivider';

interface Composition {
    Divider: typeof PageBarDivider;
}

const PageBar: FunctionComponent<HTMLAttributes<HTMLDivElement>> & Composition = (props) => {
    const { className, ...restProps } = props;
    return (
        <div
            className={twMerge(
                'container sticky top-0 z-10 mx-auto flex items-center space-x-2 border-b border-slate-200 bg-zinc-50 px-4 py-2 lg:bg-white',
                className,
            )}
            {...restProps}
        />
    );
};

PageBar.Divider = PageBarDivider;

export default PageBar;
