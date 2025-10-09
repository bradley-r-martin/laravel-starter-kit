import NavbarContext from '@/contexts/NavbarContext';
import { useDisclosure } from '@mantine/hooks';
import { FunctionComponent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import NavbarBrand from './NavbarBrand';
import NavbarDivider from './NavbarDivider';
import NavbarHamburger from './NavbarHamburger';
import NavbarItem from './NavbarItem';
import NavbarItems from './NavbarItems';

interface NavbarComposition {
    Brand: typeof NavbarBrand;
    Divider: typeof NavbarDivider;
    Items: typeof NavbarItems;
    Item: typeof NavbarItem;
    Hamburger: typeof NavbarHamburger;
}

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

const Navbar: FunctionComponent<NavbarProps> & NavbarComposition = (props) => {
    const { className, children, ...restProps } = props;
    const control = useDisclosure();
    return (
        <NavbarContext.Provider value={control}>
            <nav
                style={{
                    paddingTop: 'calc(env(safe-area-inset-top) + 0.625rem)',
                }}
                className={twMerge(
                    'flex flex-1 items-center justify-start gap-3 border-b border-zinc-950/20 px-2.5 py-2.5 lg:border-none lg:px-5',
                    className
                )}
                {...restProps}
            >
                {children}
            </nav>
        </NavbarContext.Provider>
    );
};

Navbar.Brand = NavbarBrand;
Navbar.Divider = NavbarDivider;
Navbar.Items = NavbarItems;
Navbar.Item = NavbarItem;
Navbar.Hamburger = NavbarHamburger;
export default Navbar;
