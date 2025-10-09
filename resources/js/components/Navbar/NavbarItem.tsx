import { forwardRef, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import NavbarItemButton from './NavbarItemButton';
import NavbarItemIndicator from './NavbarItemIndicator';
import NavbarItemLink from './NavbarItemLink';

interface NavbarItemComposition {
    Indicator: typeof NavbarItemIndicator;
    Button: typeof NavbarItemButton;
    Link: typeof NavbarItemLink;
}

const NavbarItemBase = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
    const { className, ...restProps } = props;
    return <div ref={ref} className={twMerge('relative', className)} {...restProps} />;
});

const NavbarItem = NavbarItemBase as typeof NavbarItemBase & NavbarItemComposition;
NavbarItem.Indicator = NavbarItemIndicator;
NavbarItem.Button = NavbarItemButton;
NavbarItem.Link = NavbarItemLink;

export default NavbarItem;
