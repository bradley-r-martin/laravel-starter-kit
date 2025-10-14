import { TableTrProps } from '@mantine/core';
import { motion, MotionProps } from 'motion/react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import TableTr from './TableTr';
type Composition = object;

function asTableTbodyTr<TProps extends object>(WrappedComponent: React.ComponentType<TProps>) {
    type EnhancedProps = TProps & {
        disabled?: boolean;
        className?: string;
    } & MotionProps;

    const Component = forwardRef<HTMLTableRowElement, EnhancedProps>((props, ref) => {
        const { disabled, className, ...restProps } = props as EnhancedProps;
        const additionalProps: Partial<TableTrProps & MotionProps & { component: typeof motion.tr }> = {
            className: twMerge(
                `grid grid-cols-2 gap-px md:table-row text-xs ${disabled ? 'disabled-bg text-slate-400' : 'text-slate-600'}`,
                className,
            ),
            animate: { opacity: 1 },
            initial: { opacity: 0 },
            exit: { opacity: 0 },
            component: motion.tr,
        };

        return <WrappedComponent {...additionalProps} {...(restProps as TProps)} ref={ref} />;
    }) as React.ForwardRefExoticComponent<React.PropsWithoutRef<EnhancedProps> & React.RefAttributes<HTMLTableRowElement>> & Composition;

    Component.displayName = `asTableTbodyTr(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return Component;
}

export default asTableTbodyTr(TableTr);
