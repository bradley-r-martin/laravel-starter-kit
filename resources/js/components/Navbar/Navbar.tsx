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
                    'bg-white data-[opened=true]:rounded-b-3xl lg:bg-transparent relative z-20 grid grid-cols-1 grid-rows-1 lg:flex flex-1 items-center justify-start pb-2 lg:gap-3 border-b border-zinc-950/20 px-2.5 lg:py-2.5 lg:border-none lg:px-5',
                    className
                )}
                {...restProps}
            >
                {children}
            </nav>
            <div data-opened={control[0]} className='data-[opened=true]:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out data-[opened=false]:pointer-events-none  z-10 fixed inset-0 bg-zinc-400/30 backdrop-blur-[1px]'></div>
        </NavbarContext.Provider>
    );
};

Navbar.Brand = NavbarBrand;
Navbar.Divider = NavbarDivider;
Navbar.Items = NavbarItems;
Navbar.Item = NavbarItem;
Navbar.Hamburger = NavbarHamburger;
export default Navbar;
