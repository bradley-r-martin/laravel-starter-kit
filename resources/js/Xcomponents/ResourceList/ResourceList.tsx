import { Empty } from '@/components/Empty';
import { Pagination } from '@/components/Pagination';
import Table from '@/components/Table/Table';
import Header from '@/Parts/Header';
import { Paginated } from '@/Types';
import { Head } from '@inertiajs/react';
import { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

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

export interface ResourceListProps<TItem> {
    headTitle: string;
    title: string;
    items: Paginated<TItem>;
    resource: ResourceIdentifiers;
    rowKey: (item: TItem) => string | number;
    columns: ResourceColumn<TItem>[];
    actionsColumn?: ResourceColumn<TItem>;
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
    emptyState,
    filters,
    headerAction,
    countLabel,
    containerClassName,
    paginationAttribute,
    getRowTestId,
    tableProps,
}: ResourceListProps<TItem>) => {
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
                                {actionsColumn && (
                                    <Table.Th
                                        key={actionsColumn.accessor}
                                        className={actionsColumn.headerClassName}
                                        style={{
                                            width: actionsColumn.width,
                                            ...(actionsColumn.headerStyle ?? {}),
                                        }}
                                    >
                                        {actionsColumn.header}
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
                                    <Table.Tbody.Tr key={key} data-testid={rowTestId}>
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
                                        {actionsColumn && (
                                            <Table.Tbody.Td
                                                key={actionsColumn.accessor}
                                                data-span={actionsColumn.dataSpan}
                                                data-testid={`${rowTestId}-${actionsColumn.accessor}`}
                                                className={actionsColumn.cellClassName}
                                                style={actionsColumn.cellStyle}
                                            >
                                                {actionsColumn.render(item)}
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
