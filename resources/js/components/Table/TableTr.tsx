import { TableTr, TableTrProps } from '@mantine/core';
import { forwardRef } from 'react';
type Composition = object;

function asTableTr<TProps extends object>(WrappedComponent: React.ComponentType<TProps>) {
    type EnhancedProps = TProps & {};

    const Component = forwardRef<HTMLTableRowElement, EnhancedProps>((props, ref) => {
        const additionalProps: Partial<TableTrProps> = {};

        return <WrappedComponent {...additionalProps} {...(props as TProps)} ref={ref} />;
    }) as React.ForwardRefExoticComponent<
        React.PropsWithoutRef<EnhancedProps> & React.RefAttributes<HTMLTableRowElement>
    > &
        Composition;

    Component.displayName = `asTableTr(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return Component;
}

export default asTableTr(TableTr);
