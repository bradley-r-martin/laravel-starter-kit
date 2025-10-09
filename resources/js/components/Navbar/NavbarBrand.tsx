import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import Logo from '../../../img/Logo.svg?react';
import useNavbar from '@/hooks/useNavbar';

const NavbarBrand: FunctionComponent<HTMLAttributes<HTMLOrSVGElement>> = (props) => {
    const { className, ...restProps } = props;
    const [opened] = useNavbar();
    return <Logo data-opened={opened} className={twMerge('h-10 lg:h-8  data-[opened=true]:opacity-0 transition-opacity duration-300 ease-in-out', className)} aria-hidden="true" {...restProps} />;
};

export default NavbarBrand;
