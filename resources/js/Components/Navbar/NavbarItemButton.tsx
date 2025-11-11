import { Button, ButtonProps } from '@mantine/core';
import { FunctionComponent } from 'react';
import { twMerge } from 'tailwind-merge';
import classNames from './NavbarItemButton.module.css';

const NavbarItemButton: FunctionComponent<ButtonProps> = (props) => {
    const { className, ...restProps } = props;
    const additionalProps = {
        radius: 'md',
        variant: 'subtle',
        color: 'zinc',
        size: 'sm',
    };
    return (
        <Button
            classNames={classNames}
            className={twMerge(
                'data-[loading]:animate-pulse data-[loading]:!bg-zinc-950/10',
                className
            )}
            {...additionalProps}
            {...restProps}
        />
    );
};

export default NavbarItemButton;
