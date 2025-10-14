import { Stack, StackProps } from '@mantine/core';
import { forwardRef } from 'react';

function asTableWrapper<TProps extends object>(WrappedComponent: React.ComponentType<TProps>) {
    type EnhancedProps = TProps & {};

    const Component = forwardRef<HTMLDivElement, EnhancedProps>((props, ref) => {
        const additionalProps: Partial<StackProps> = {
            className: 'overflow-hidden rounded border border-slate-300 bg-white shadow shadow-slate-200',
        };

        return <WrappedComponent gap={0} {...additionalProps} {...(props as TProps)} ref={ref} />;
    });

    Component.displayName = `asTableWrapper(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return Component;
}

export default asTableWrapper(Stack);
