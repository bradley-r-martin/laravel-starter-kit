import { TableThead, TableTheadProps } from '@mantine/core';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import TableTheadTr from './TableTheadTr';
type Composition = {
    Tr: typeof TableTheadTr;
};

function asTableThead<TProps extends object>(WrappedComponent: React.ComponentType<TProps>) {
    type EnhancedProps = TProps & {};

    const Component = forwardRef<HTMLTableSectionElement, EnhancedProps>((props, ref) => {
        const { className, ...restProps } = props as TableTheadProps;
        const additionalProps: Partial<TableTheadProps> = {
            className: twMerge('hidden md:table-header-group', className),
        };

        return <WrappedComponent {...additionalProps} {...(restProps as TProps)} ref={ref} />;
    }) as React.ForwardRefExoticComponent<React.PropsWithoutRef<EnhancedProps> & React.RefAttributes<HTMLTableSectionElement>> & Composition;

    Component.displayName = `asTableThead(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    Component.Tr = TableTheadTr;

    return Component;
}

export default asTableThead(TableThead);
