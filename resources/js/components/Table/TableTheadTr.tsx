import { TableTrProps } from '@mantine/core';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import TableTr from './TableTr';
type Composition = object;

function asTableTheadTr<TProps extends object>(WrappedComponent: React.ComponentType<TProps>) {
    type EnhancedProps = TProps & {};

    const Component = forwardRef<HTMLTableRowElement, EnhancedProps>((props, ref) => {
        const { className, ...restProps } = props as TableTrProps;
        const additionalProps: Partial<TableTrProps> = {
            className: twMerge('font-bold text-slate-500 text-xs uppercase', className),
        };

        return <WrappedComponent {...additionalProps} {...(restProps as TProps)} ref={ref} />;
    }) as React.ForwardRefExoticComponent<
        React.PropsWithoutRef<EnhancedProps> & React.RefAttributes<HTMLTableRowElement>
    > &
        Composition;

    Component.displayName = `asTableTheadTr(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return Component;
}

export default asTableTheadTr(TableTr);
