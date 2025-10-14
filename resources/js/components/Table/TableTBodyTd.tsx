import { TableTd, TableTdProps } from '@mantine/core';
import { forwardRef } from 'react';
type Composition = object;

function asTableTbodyTd<TProps extends object>(WrappedComponent: React.ComponentType<TProps>) {
    type EnhancedProps = TProps & {
        disabled?: boolean;
    };

    const Component = forwardRef<HTMLTableCellElement, EnhancedProps>((props, ref) => {
        const { ...restProps } = props as EnhancedProps;
        const additionalProps: Partial<TableTdProps> = {};

        return <WrappedComponent {...additionalProps} {...(restProps as TProps)} ref={ref} />;
    }) as React.ForwardRefExoticComponent<React.PropsWithoutRef<EnhancedProps> & React.RefAttributes<HTMLTableCellElement>> & Composition;

    Component.displayName = `asTableTbodyTd(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return Component;
}

export default asTableTbodyTd(TableTd);
