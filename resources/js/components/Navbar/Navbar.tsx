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
                data-opened={control[0]}
                style={{
                    paddingTop: 'calc(env(safe-area-inset-top) + 0.625rem)',
                }}
                className={twMerge(
                    'relative z-20 grid flex-1 grid-cols-1 grid-rows-1 items-center justify-start border-b border-zinc-950/20 bg-white px-2.5 pb-2 data-[opened=true]:rounded-b-3xl lg:flex lg:gap-3 lg:border-none lg:bg-transparent lg:px-5 lg:py-2.5',
                    className
                )}
                {...restProps}
            >
                {children}
            </nav>
            <div
                data-opened={control[0]}
                className="fixed inset-0 z-10 bg-zinc-400/30 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 ease-in-out data-[opened=false]:pointer-events-none data-[opened=true]:opacity-100"
            ></div>
        </NavbarContext.Provider>
    );
};

Navbar.Brand = NavbarBrand;
Navbar.Divider = NavbarDivider;
Navbar.Items = NavbarItems;
Navbar.Item = NavbarItem;
Navbar.Hamburger = NavbarHamburger;
export default Navbar;
