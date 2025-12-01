import { TableTbody, TableTbodyProps } from '@mantine/core';
import {  motion, MotionProps } from 'motion/react';
import { forwardRef, ReactNode } from 'react';
import TableTBodyTd from './TableTBodyTd';
import TableTBodyTr from './TableTBodyTr';
type Composition = {
    Tr: typeof TableTBodyTr;
    Td: typeof TableTBodyTd;
};

function asTableTbody<TProps extends object>(WrappedComponent: React.ComponentType<TProps>) {
    type EnhancedProps = TProps & {};

    const Component = forwardRef<HTMLTableSectionElement, EnhancedProps>((props, ref) => {
        const { children, ...restProps } = props as TProps & { children: ReactNode };
        const additionalProps: Partial<
            TableTbodyProps & MotionProps & {  }
        > = {
         
        };

        return (
            <WrappedComponent {...additionalProps} {...(restProps as TProps)} ref={ref}>
                    {children}
            </WrappedComponent>
        );
    }) as React.ForwardRefExoticComponent<
        React.PropsWithoutRef<EnhancedProps> & React.RefAttributes<HTMLTableSectionElement>
    > &
        Composition;

    Component.displayName = `asTableTbody(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    Component.Tr = TableTBodyTr;
    Component.Td = TableTBodyTd;

    return Component;
}

export default asTableTbody(TableTbody);
