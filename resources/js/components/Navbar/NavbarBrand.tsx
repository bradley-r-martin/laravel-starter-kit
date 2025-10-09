import { FunctionComponent, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import Logo from '../../../img/Logo.svg?react';

const NavbarBrand: FunctionComponent<HTMLAttributes<HTMLOrSVGElement>> = (props) => {
    const { className, ...restProps } = props;
    return <Logo className={twMerge('h-8', className)} aria-hidden="true" {...restProps} />;
};

export default NavbarBrand;
