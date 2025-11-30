import Table from '@/Components/Table/Table';
import { Paginated } from '@/Types';
import { isMobile } from '@/Utilities/Environment';
import { ChevronRight } from 'lucide-react';
import { FunctionComponent, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface TableColumn<T> {
    name: string;
    cellProps?: React.TdHTMLAttributes<HTMLTableCellElement> & {
        'data-title'?: string;
    };
    cell: (item: T) => React.ReactNode;
}

interface RowListViewProps<T> {
    data: Paginated<T>;
    columns: TableColumn<T>[];
}

const RowListView: FunctionComponent<RowListViewProps<any>> = (props) => {
    const { data, columns } = props;
    const [selectedRow, setSelectedRow] = useState<null | string | number>(null);

    const mobile = isMobile();
    const cellClassName = mobile ? 'col-span-1/2 p-3! flex-col  bg-white' : '';

    return (
        <div className="p-4">
            <Table className={mobile ? 'border-none! bg-transparent! shadow-none!' : ''}>
                <Table.Thead>
                    <Table.Thead.Tr>
                        {columns.map((column) => (
                            <Table.Th key={column.name}>{column.name}</Table.Th>
                        ))}
                    </Table.Thead.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {data.data.map((row, index) => {
                        const isSelected = selectedRow === row.id;
                        const prevRow = index > 0 ? data.data[index - 1] : null;
                        const nextRow = index < data.data.length - 1 ? data.data[index + 1] : null;
                        const isPrevSelected = prevRow ? selectedRow === prevRow.id : false;
                        const isNextSelected = nextRow ? selectedRow === nextRow.id : false;

                        return (
                            <Table.Tbody.Tr
                                key={row.id}
                                onClick={() =>
                                    setSelectedRow(selectedRow === row.id ? null : row.id)
                                }
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
                                {columns.map((column, index) => (
                                    <Table.Td
                                        key={column.name}
                                        {...(index === 0
                                            ? {}
                                            : {
                                                  'data-title': column.name,
                                              })}
                                        {...column?.cellProps}
                                        className={
                                            mobile
                                                ? twMerge(
                                                      cellClassName,
                                                      index !== 0
                                                          ? 'hidden data-[selected=true]:flex'
                                                          : 'flex flex-row items-center justify-between',
                                                      column.cellProps?.className
                                                  )
                                                : column.cellProps?.className
                                        }
                                        data-selected={selectedRow === row.id}
                                    >
                                        {column.cell(row)}
                                        {index === 0 && mobile && (
                                            <ChevronRight
                                                className="size-4 transition-transform duration-300 data-[selected=true]:rotate-90!"
                                                data-selected={selectedRow === row.id}
                                            />
                                        )}
                                    </Table.Td>
                                ))}
                            </Table.Tbody.Tr>
                        );
                    })}
                </Table.Tbody>
            </Table>
        </div>
    );
};

export default RowListView;
