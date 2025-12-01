import Table from '@/Components/Table/Table';
import { Paginated } from '@/Types';
import { isMobile } from '@/Utilities/Environment';
import { ChevronRight } from 'lucide-react';
import { FunctionComponent, useState, useMemo, memo, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

export interface TableColumn<T> {
    name: string;
    cellProps?: React.TdHTMLAttributes<HTMLTableCellElement> & {
        'data-title'?: string;
    };
    cell: (item: T) => React.ReactNode;
}

interface ResourceListTableProps<T> {
    data: Paginated<T>;
    columns: TableColumn<T>[];
}

interface TableRowProps<T> {
    row: T;
    rowIndex: number;
    columns: TableColumn<T>[];
    selectedRow: null | string | number;
    mobile: boolean;
    cellClassName: string;
    allRows: T[];
    onRowClick: (rowId: string | number) => void;
}

const TableRow = memo(function TableRow<T extends { id: string | number }>(props: TableRowProps<T>) {
    const { row, rowIndex, columns, selectedRow, mobile, cellClassName, allRows, onRowClick } = props;
    
    const isSelected = selectedRow === row.id;
    const prevRow = rowIndex > 0 ? allRows[rowIndex - 1] : null;
    const nextRow = rowIndex < allRows.length - 1 ? allRows[rowIndex + 1] : null;
    const isPrevSelected = prevRow ? selectedRow === prevRow.id : false;
    const isNextSelected = nextRow ? selectedRow === nextRow.id : false;

    const handleClick = useCallback(() => {
        onRowClick(row.id);
    }, [row.id, onRowClick]);

    return (
        <Table.Tbody.Tr
            key={row.id}
            onClick={mobile ? handleClick : undefined}
            data-selected={isSelected}
            className={
                mobile
                    ? twMerge(
                          '-mt-px! gap-px overflow-hidden border border-b! border-zinc-300 border-b-zinc-300! bg-slate-200! transition-all duration-300 first:rounded-t-lg! last:rounded-b-lg! data-[selected=true]:my-5! data-[selected=true]:rounded-lg! data-[selected=true]:shadow-xl',
                          isPrevSelected && 'rounded-t-lg!',
                          isNextSelected && 'rounded-b-lg!'
                      )
                    : ''
            }
        >
            {columns.map((column, colIndex) => (
                <Table.Td
                    key={column.name}
                    {...(colIndex === 0
                        ? {}
                        : {
                              'data-title': column.name,
                          })}
                    {...column?.cellProps}
                    className={
                        mobile
                            ? twMerge(
                                  cellClassName,
                                  colIndex !== 0
                                      ? 'hidden data-[selected=true]:flex'
                                      : 'flex flex-row items-center justify-between',
                                  column.cellProps?.className
                              )
                            : column.cellProps?.className
                    }
                    data-selected={isSelected}
                >
                    {column.cell(row)}
                    {colIndex === 0 && mobile && (
                        <ChevronRight
                            className="size-4 transition-transform duration-300 data-[selected=true]:rotate-90!"
                            data-selected={isSelected}
                        />
                    )}
                </Table.Td>
            ))}
        </Table.Tbody.Tr>
    );
}) as <T extends { id: string | number }>(props: TableRowProps<T>) => React.ReactElement;

const ResourceListTable: FunctionComponent<ResourceListTableProps<any>> = (props) => {
    const { data, columns } = props;
    const [selectedRow, setSelectedRow] = useState<null | string | number>(null);

    const mobile = useMemo(() => isMobile(), []);
    const cellClassName = useMemo(() => mobile ? 'col-span-1/2 p-3! flex-col  bg-white' : '', [mobile]);
    const tableClassName = useMemo(() => mobile ? 'border-none! bg-transparent! shadow-none!' : '', [mobile]);

    const handleRowClick = useCallback((rowId: string | number) => {
        setSelectedRow(prev => prev === rowId ? null : rowId);
    }, []);

    return (
        <div className="p-4">
            <Table className={tableClassName}>
                <Table.Thead>
                    <Table.Thead.Tr>
                        {columns.map((column) => (
                            <Table.Th key={column.name}>{column.name}</Table.Th>
                        ))}
                    </Table.Thead.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {data.data.map((row, index) => (
                        <TableRow
                            key={row.id}
                            row={row}
                            rowIndex={index}
                            columns={columns}
                            selectedRow={selectedRow}
                            mobile={mobile}
                            cellClassName={cellClassName}
                            allRows={data.data}
                            onRowClick={handleRowClick}
                        />
                    ))}
                </Table.Tbody>
            </Table>
        </div>
    );
};

export default memo(ResourceListTable) as typeof ResourceListTable;
