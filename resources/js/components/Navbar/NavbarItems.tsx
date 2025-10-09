import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const NavbarItems: FunctionComponent<HTMLAttributes<HTMLDivElement>> = (props) => {
    const { className, ...restProps } = props;
    return (
        <div
            className={twMerge('flex flex-1 items-center justify-start gap-3', className)}
            {...restProps}
        />
    );
};

export default NavbarItems;
