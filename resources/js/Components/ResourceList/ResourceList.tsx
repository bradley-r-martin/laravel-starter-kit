import { Empty } from '@/Components/Empty';
import { Pagination } from '@/Components/Pagination';
import Table from '@/Components/Table/Table';
import Header from '@/Parts/Header';
import { Paginated } from '@/Types';
import { Head } from '@inertiajs/react';
import { ComponentPropsWithoutRef, CSSProperties, ReactNode, useState } from 'react';
import ResourceListAction from './ResourceListAction';

export interface ResourceAction {
    visible?: boolean;
    icon?: any;
    tooltip?: string;
    label?: string;
    href: string;
    type: 'modal' | 'page';
    color: string;
}

interface ResourceIdentifiers {
    singular: string;
    plural: string;
}

export interface ResourceColumn<TItem> {
    header: ReactNode;
    accessor: string;
    render: (item: TItem) => ReactNode;
    dataSpan?: string;
    width?: string | number;
    headerClassName?: string;
    headerStyle?: CSSProperties;
    cellClassName?: string;
    cellStyle?: CSSProperties;
}

export interface ActionsColumnProps {
    width?: string | number;
    header?: ReactNode;
    headerClassName?: string;
    headerStyle?: CSSProperties;
    cellClassName?: string;
    cellStyle?: CSSProperties;
    dataSpan?: string;
}

export interface ResourceListProps<TItem> {
    headTitle: string;
    title: string;
    items: Paginated<TItem>;
    resource: ResourceIdentifiers;
    rowKey: (item: TItem) => string | number;
    columns: ResourceColumn<TItem>[];
    actionsColumn?: ResourceColumn<TItem>;
    actionsColumnProps?: ActionsColumnProps;
    actions?: (item: TItem) => ResourceAction[];
    emptyState: {
        title: string;
        subtitle: string;
    };
    filters?: ReactNode;
    headerAction?: ReactNode;
    countLabel?: (count: number) => ReactNode;
    containerClassName?: string;
    paginationAttribute?: string;
    getRowTestId?: (item: TItem) => string;
    tableProps?: ComponentPropsWithoutRef<typeof Table>;
}

const defaultContainerClassName = 'container mx-auto mt-5 px-3 pb-[800px] lg:px-5';

const ResourceList = <TItem,>({
    headTitle,
    title,
    items,
    resource,
    rowKey,
    columns,
    actionsColumn,
    actionsColumnProps,
    emptyState,
    filters,
    headerAction,
    countLabel,
    containerClassName,
    paginationAttribute,
    getRowTestId,
    tableProps,
    actions,
}: ResourceListProps<TItem>) => {
    const [selectedRow, setSelectedRow] = useState<null | string | number>(null);
    const count = items.data.length;
    const resolvedPaginationAttribute = paginationAttribute ?? resource.plural;
    const renderCountLabel =
        countLabel ??
        ((value: number) => (
            <div className="text-xs text-zinc-500">
                {value} {resource.plural}
            </div>
        ));
    const containerClasses = [defaultContainerClassName, containerClassName]
        .filter(Boolean)
        .join(' ');

    // Support both old actionsColumn and new actionsColumnProps for backward compatibility
    const shouldShowActions = actions && (actionsColumn || actionsColumnProps);
    const actionsHeader = actionsColumn?.header ?? actionsColumnProps?.header ?? 'Actions';
    const actionsAccessor = actionsColumn?.accessor ?? 'actions';
    const actionsWidth = actionsColumn?.width ?? actionsColumnProps?.width;
    const actionsHeaderClassName =
        actionsColumn?.headerClassName ?? actionsColumnProps?.headerClassName;
    const actionsHeaderStyle = actionsColumn?.headerStyle ?? actionsColumnProps?.headerStyle;
    const actionsCellClassName = actionsColumn?.cellClassName ?? actionsColumnProps?.cellClassName;
    const actionsCellStyle = actionsColumn?.cellStyle ?? actionsColumnProps?.cellStyle;
    const actionsDataSpan = actionsColumn?.dataSpan ?? actionsColumnProps?.dataSpan;

    return (
        <>
            <Head title={headTitle} />
            <Header
                title={title}
                subtitle={renderCountLabel(count)}
                action={headerAction}
                filters={filters}
            />
            <div className={containerClasses}>
                {count === 0 ? (
                    <Empty title={emptyState.title} subtitle={emptyState.subtitle} />
                ) : (
                    <Table striped {...tableProps}>
                        <Table.Thead>
                            <Table.Thead.Tr>
                                {columns.map((column) => (
                                    <Table.Th
                                        key={column.accessor}
                                        className={column.headerClassName}
                                        style={{
                                            width: column.width,
                                            ...(column.headerStyle ?? {}),
                                        }}
                                    >
                                        {column.header}
                                    </Table.Th>
                                ))}
                                {shouldShowActions && (
                                    <Table.Th
                                        key={actionsAccessor}
                                        className={actionsHeaderClassName}
                                        style={{
                                            width: actionsWidth,
                                            ...(actionsHeaderStyle ?? {}),
                                        }}
                                    >
                                        {actionsHeader}
                                    </Table.Th>
                                )}
                            </Table.Thead.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {items.data.map((item) => {
                                const key = rowKey(item);
                                const rowTestId =
                                    getRowTestId?.(item) ??
                                    `${resource.singular}-row-${String(key)}`;

                                return (
                                    <Table.Tbody.Tr
                                        key={key}
                                        data-testid={rowTestId}
                                        onClick={() => setSelectedRow(key)}
                                        data-selected={selectedRow === key}
                                    >
                                        {columns.map((column) => (
                                            <Table.Tbody.Td
                                                key={column.accessor}
                                                data-span={column.dataSpan}
                                                data-testid={`${rowTestId}-${column.accessor}`}
                                                className={column.cellClassName}
                                                style={column.cellStyle}
                                            >
                                                {column.render(item)}
                                            </Table.Tbody.Td>
                                        ))}
                                        {shouldShowActions && (
                                            <Table.Tbody.Td
                                                key={actionsAccessor}
                                                data-span={actionsDataSpan}
                                                data-testid={`${rowTestId}-${actionsAccessor}`}
                                                className={actionsCellClassName}
                                                style={actionsCellStyle}
                                            >
                                                {actions?.(item).map((action) => (
                                                    <ResourceListAction
                                                        key={action.href}
                                                        {...action}
                                                    />
                                                ))}
                                            </Table.Tbody.Td>
                                        )}
                                    </Table.Tbody.Tr>
                                );
                            })}
                        </Table.Tbody>
                    </Table>
                )}
                <Pagination data={items} attribute={resolvedPaginationAttribute} />
            </div>
        </>
    );
};

export default ResourceList;
