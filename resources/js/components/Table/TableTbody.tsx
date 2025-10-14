import { TableTbody, TableTbodyProps } from '@mantine/core';
import { AnimatePresence, motion, MotionProps } from 'motion/react';
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
        const additionalProps: Partial<TableTbodyProps & MotionProps & { component: typeof motion.tbody }> = {
            animate: { opacity: 1, height: 'auto' },
            initial: { opacity: 0, height: 0 },
            exit: { opacity: 0, height: 0 },
            component: motion.tbody,
        };

        return (
            <WrappedComponent {...additionalProps} {...(restProps as TProps)} ref={ref}>
                <AnimatePresence mode="wait" initial={false}>
                    {children}
                </AnimatePresence>
            </WrappedComponent>
        );
    }) as React.ForwardRefExoticComponent<React.PropsWithoutRef<EnhancedProps> & React.RefAttributes<HTMLTableSectionElement>> & Composition;

    Component.displayName = `asTableTbody(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    Component.Tr = TableTBodyTr;
    Component.Td = TableTBodyTd;

    return Component;
}

export default asTableTbody(TableTbody);
