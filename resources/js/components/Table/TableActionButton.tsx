import { useBreakpoint } from '@/Hooks/useBreakpoint';
import { ActionIcon, ButtonProps, Text, Tooltip } from '@mantine/core';
import { forwardRef, ReactNode } from 'react';
import ModalButton, { ModalButtonProps } from '../ModalButton';
type Composition = object;

function asTableActionButton<TProps extends object>(WrappedComponent: React.ComponentType<TProps>) {
    type EnhancedProps = TProps & {
        icon: ReactNode;
        children: ReactNode;
    };

    const Component = forwardRef<HTMLButtonElement, EnhancedProps>((props, ref) => {
        const { icon, children, ...restProps } = props as EnhancedProps;
        const isDesktop = useBreakpoint('lg');
        const additionalProps: Partial<ModalButtonProps & ButtonProps> = {
            ...(isDesktop
                ? {
                      as: ActionIcon as unknown as 'button',
                      variant: 'subtle',
                      size: 'md',
                      children: icon,
                  }
                : {
                      variant: 'light',
                      size: 'lg',
                      fullWidth: true,
                      leftSection: icon,
                      justify: 'left',
                      children,
                  }),
        };

        return (
            <Tooltip
                label={<Text size="xs">{children}</Text>}
                withArrow
                className="uppercase"
                openDelay={isDesktop ? 0 : 300000}
            >
                <WrappedComponent {...additionalProps} {...(restProps as TProps)} ref={ref} />
            </Tooltip>
        );
    }) as React.ForwardRefExoticComponent<
        React.PropsWithoutRef<EnhancedProps> & React.RefAttributes<HTMLButtonElement>
    > &
        Composition;

    Component.displayName = `asTableActionButton(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return Component;
}

export default asTableActionButton(ModalButton);
