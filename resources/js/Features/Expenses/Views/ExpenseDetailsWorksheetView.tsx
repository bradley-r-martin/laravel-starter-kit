import { usePage } from '@inertiajs/react';
import { Button } from '@mantine/core';

import Navigate from '@/Components/Navigate';
import Table from '@/Components/Table/Table';
import { Grid2X2PlusIcon } from 'lucide-react';
import { FunctionComponent } from 'react';
import ExpenseItemRow from '../Parts/ExpenseDetailsWorksheetItemRowPart';
import ExpenseTableHeaders from '../Parts/ExpenseDetailsWorksheetTableHeadersPart';

const ExpenseDetailsWorksheet: FunctionComponent = () => {
    const { expense } = usePage<{
        expense: Models.Expense & {
            pages?: any[] | null;
            operator?: { id: string; name: string } | null;
            expense_items?: (Models.ExpenseItem & { __product_name?: string | null })[];
        };
    }>().props;
    const isCompleted = !!expense.completed_at;

    return (
        <Table withColumnBorders highlightOnHover={!isCompleted}>
            <Table.Thead className="bg-slate-100 text-left text-sm">
                <ExpenseTableHeaders />
            </Table.Thead>
            <Table.Tbody>
                {expense.expense_items?.map((item, i) => (
                    <ExpenseItemRow
                        key={item.id}
                        item={item}
                        index={i}
                        expenseId={expense.id}
                        isCompleted={isCompleted}
                    />
                ))}
            </Table.Tbody>
            {!isCompleted && (
                <Table.Tfoot>
                    <Table.Tr className="border-t border-slate-300">
                        <Table.Td colSpan={8} p={0}>
                            <Navigate
                                type="page"
                                method="post"
                                href={route('expense-items.store', { expense_id: expense.id })}
                            >
                                <Button
                                    fullWidth
                                    size="sm"
                                    justify="left"
                                    variant="subtle"
                                    color="gray"
                                    radius={0}
                                    leftSection={<Grid2X2PlusIcon className="size-4" />}
                                >
                                    Add expense row
                                </Button>
                            </Navigate>
                        </Table.Td>
                    </Table.Tr>
                </Table.Tfoot>
            )}
        </Table>
    );
};

export default ExpenseDetailsWorksheet;
