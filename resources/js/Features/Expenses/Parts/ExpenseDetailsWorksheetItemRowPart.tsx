import Table from '@/Components/Table/Table';
import { ActionIcon, NumberInput, Select } from '@mantine/core';

import { FunctionComponent } from 'react';

import { ExpenseItem } from '@/Pages/Expense/View';
import { FileWarning, TrashIcon } from 'lucide-react';

import Cast from '@/Components/Cast';
import Data from '@/Components/Data/Data';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import { useForm } from '@inertiajs/react';

interface ExpenseItemRowProps {
    item: ExpenseItem;
    index: number;
    expenseId: string;
    isCompleted: boolean;
}

const ExpenseItemRow: FunctionComponent<ExpenseItemRowProps> = ({
    item,
    index,
    expenseId,
    isCompleted,
}) => {
    const form = useForm({});

    return (
        <Table.Tbody.Tr
            key={item.id}
            layoutId={String(item.id)}
            className={`group ${!item.product_id ? 'striped-amber-bg' : ''}`}
        >
            <Table.Tbody.Td p={0} className="text-center font-bold text-slate-600">
                <div
                    style={{ width: 34 }}
                    className={`text-sm ${isCompleted ? '' : 'lg:group-hover:hidden'}`}
                >
                    {index + 1}
                </div>
                <div className={`text-sm lg:hidden ${isCompleted ? '' : 'lg:group-hover:flex'}`}>
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="lg"
                        radius={0}
                        styles={{
                            root: {
                                height: '36px',
                            },
                        }}
                    >
                        <TrashIcon className="size-4" />
                    </ActionIcon>
                </div>
            </Table.Tbody.Td>
            <Table.Tbody.Td p={0} data-title="Product" className="col-span-2">
                <Form
                    form={form}
                    action={{
                        url: route('expense-items.update', item.id),
                        method: 'patch',
                    }}
                >
                    <Field name="product_id" type="select" live>
                        <Data
                            parameter="products"
                            map={(d: any) => ({ value: d.id, label: d.name })}
                        >
                            <Select
                                variant="transparent"
                                placeholder={item.name as string}
                                searchable
                                clearable
                                styles={{ root: { width: '100%' } }}
                                radius={0}
                                classNames={{
                                    wrapper: 'focus-within:bg-white',
                                    input: 'disabled:!bg-white disabled:!opacity-100 disabled:!cursor-default placeholder:!text-amber-600 !border !border-transparent hover:!outline-1 hover:!outline-slate-950/40 hover:!outline-offset-[-2px] hover:focus:!outline-none disabled:hover:outline-none  focus:!bg-blue-500/5 !shadow-none !drop-shadow-none focus:!shadow-inner focus:placeholder:!text-slate-600 focus:!bg-blue-500/5 focus:!drop-shadow focus:!border focus:!border-blue-500 focus:!ring-blue-500/20',
                                }}
                                leftSection={
                                    !item.product_id ? (
                                        <FileWarning className="size-4 text-amber-500" />
                                    ) : null
                                }
                                rightSection={isCompleted ? <span /> : undefined}
                                disabled={isCompleted}
                            />
                        </Data>
                    </Field>
                </Form>
            </Table.Tbody.Td>
            <Table.Tbody.Td p={0} data-title="QTY" className="col-span-2">
                <Form form={form}>
                    <Field name="units">
                        <NumberInput
                            disabled={isCompleted}
                            variant="transparent"
                            min={0}
                            step={1}
                            hideControls
                            radius={0}
                            classNames={{
                                wrapper: 'focus-within:bg-white',
                                input: 'disabled:!bg-white disabled:!opacity-100 disabled:!cursor-default placeholder:!text-amber-600 !border !border-transparent hover:!outline-1 hover:!outline-slate-950/40 hover:!outline-offset-[-2px] hover:focus:!outline-none disabled:hover:outline-none  focus:!bg-blue-500/5 !shadow-none !drop-shadow-none focus:!shadow-inner focus:placeholder:!text-slate-600 focus:!bg-blue-500/5 focus:!drop-shadow focus:!border focus:!border-blue-500 focus:!ring-blue-500/20',
                            }}
                        />
                    </Field>
                </Form>
            </Table.Tbody.Td>
            <Table.Tbody.Td p={0} data-title="Price" className="col-span-2">
                <Form form={form}>
                    <Field name="wholesale_cost">
                        <NumberInput
                            disabled={isCompleted}
                            variant="transparent"
                            prefix="$"
                            decimalScale={2}
                            decimalSeparator="."
                            min={0}
                            hideControls
                            radius={0}
                            classNames={{
                                wrapper: 'focus-within:bg-white',
                                input: 'disabled:!bg-white disabled:!opacity-100 disabled:!cursor-default placeholder:!text-amber-600 !border !border-transparent hover:!outline-1 hover:!outline-slate-950/40 hover:!outline-offset-[-2px] hover:focus:!outline-none disabled:hover:outline-none  focus:!bg-blue-500/5 !shadow-none !drop-shadow-none focus:!shadow-inner focus:placeholder:!text-slate-600 focus:!bg-blue-500/5 focus:!drop-shadow focus:!border focus:!border-blue-500 focus:!ring-blue-500/20',
                            }}
                        />
                    </Field>
                </Form>
            </Table.Tbody.Td>
            <Table.Tbody.Td p={0} data-title="Units" className="disabled-bg">
                <div className="p-2 px-3 text-sm">{item.product_units}</div>
            </Table.Tbody.Td>
            <Table.Tbody.Td p={0} data-title="RRP" className="disabled-bg">
                <div className="p-2 px-3 text-sm">
                    <Cast.Currency>{item.product_rrp}</Cast.Currency>
                </div>
            </Table.Tbody.Td>
            <Table.Tbody.Td p={0} data-title="Royalty" className="disabled-bg">
                <div className="p-2 px-3 text-sm">
                    <Cast.Currency>{item.product_royalty}</Cast.Currency>
                </div>
            </Table.Tbody.Td>
            <Table.Tbody.Td p={0} data-title="Rebate" className="disabled-bg">
                <div className="p-2 px-3 text-sm">
                    <Cast.Currency>{item.product_rebate}</Cast.Currency>
                </div>
            </Table.Tbody.Td>
        </Table.Tbody.Tr>
    );
};

export default ExpenseItemRow;
