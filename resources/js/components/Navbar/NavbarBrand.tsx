import useNavbar from '@/XHooks/useNavbar';
import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import Logo from '../../../img/Logo.svg?react';

const NavbarBrand: FunctionComponent<HTMLAttributes<HTMLOrSVGElement>> = (props) => {
    const { className, ...restProps } = props;
    const [opened] = useNavbar();
    return (
        <Logo
            data-opened={opened}
            className={twMerge(
                'h-10 transition-opacity duration-300 ease-in-out data-[opened=true]:opacity-0 lg:h-8',
                className
            )}
            aria-hidden="true"
            {...restProps}
        />
    );
};

export default NavbarBrand;
