import { Table, TableProps } from '@mantine/core';
import { forwardRef } from 'react';
import TableTbody from './TableTbody';
import TableThead from './TableThead';
import TableTr from './TableTr';
import TableWrapper from './TableWrapper';
type Composition = {
    Wrapper: typeof TableWrapper;
    Thead: typeof TableThead;
    Tbody: typeof TableTbody;
    Tfoot: typeof Table.Tfoot;
    Tr: typeof TableTr;
    Th: typeof Table.Th;
    Td: typeof Table.Td;
    Caption: typeof Table.Caption;
};
function asTable<TProps extends object>(WrappedComponent: React.ComponentType<TProps>) {
    type EnhancedProps = TProps & {};

    const Component = forwardRef<HTMLTableElement, EnhancedProps>((props, ref) => {
        const additionalProps: Partial<TableProps> = {
            highlightOnHover: true,
        };

        return <WrappedComponent {...additionalProps} {...(props as TProps)} ref={ref} />;
    }) as React.ForwardRefExoticComponent<React.PropsWithoutRef<EnhancedProps> & React.RefAttributes<HTMLTableElement>> & Composition;

    Component.displayName = `asTable(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    Component.Wrapper = TableWrapper;
    Component.Thead = TableThead;
    Component.Tbody = TableTbody;
    Component.Tfoot = Table.Tfoot;
    Component.Tr = TableTr;
    Component.Th = Table.Th;
    Component.Td = Table.Td;
    Component.Caption = Table.Caption;

    return Component;
}

export default asTable(Table);
