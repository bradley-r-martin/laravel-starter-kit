import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const NavbarDivider: FunctionComponent<HTMLAttributes<HTMLDivElement>> = (props) => {
    const { className, ...restProps } = props;
    return (
        <div
            aria-hidden="true"
            className={twMerge('h-6 w-px bg-zinc-950/10 max-lg:hidden', className)}
            {...restProps}
        />
    );
};

export default NavbarDivider;
