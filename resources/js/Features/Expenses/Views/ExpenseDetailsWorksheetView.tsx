import { usePage } from '@inertiajs/react';
import { Button } from '@mantine/core';

import Table from '@/Components/Table/Table';
import { Expense } from '@/Pages/Expense/View';
import { Grid2X2PlusIcon } from 'lucide-react';
import { FunctionComponent } from 'react';
import ExpenseItemRow from '../Parts/ExpenseDetailsWorksheetItemRowPart';
import ExpenseTableHeaders from '../Parts/ExpenseDetailsWorksheetTableHeadersPart';

const ExpenseDetailsWorksheet: FunctionComponent = () => {
    const { expense } = usePage<{ expense: Expense }>().props;
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
                            <Button
                                onClick={() => {}}
                                fullWidth
                                size="sm"
                                justify="left"
                                variant="subtle"
                                color="gray"
                                radius={0}
                                leftSection={<Grid2X2PlusIcon />}
                            >
                                Add expense row
                            </Button>
                        </Table.Td>
                    </Table.Tr>
                </Table.Tfoot>
            )}
        </Table>
    );
};

export default ExpenseDetailsWorksheet;
