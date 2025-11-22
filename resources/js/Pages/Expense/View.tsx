import AppLayout from '@/Layouts/AppLayout';

import ActionWell from '@/Components/ActionWell';
import Cast from '@/Components/Cast';
import DescriptionList from '@/Components/DescriptionList';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import { Page } from '@/Components/Page';
import { InertiaView } from '@/Types';
import { Badge, Button, Stack, Table } from '@mantine/core';
import { ArrowLeftIcon, MailWarning } from 'lucide-react';

interface ExpenseItem {
    id: string;
    item: string | null;
    quantity: number;
    units: number;
    cost: number;
    rebate: number;
    royalty: number;
    price: number;
    product: { id: string; name: string } | null;
    __product_name: string | null;
}

interface Expense {
    id: string;
    invoice_no: string;
    invoice_date: string | null;
    pages: any;
    completed_at: string | null;
    closed_at: string | null;
    created_at: string;
    updated_at: string;
    operator: { id: string; name: string } | null;
    __wholesaler_name: string | null;
    __cost: number;
    __rebate: number;
    __royalty: number;
    expense_items: ExpenseItem[];
}

interface ViewProps {
    expense: Expense;
}

const View: InertiaView<ViewProps> = (props) => {
    const { expense } = props;

    const completable = expense.expense_items.every((item) => item.product);
    const itemsLeft = expense.expense_items.filter((item) => !item.product).length;

    return (
        <Page>
            <Page.Header>
                <Navigate type="page" href={route('expenses.index')}>
                    <Button
                        color="gray"
                        variant="subtle"
                        size="xs"
                        radius="xl"
                        ml={-10}
                        leftSection={<ArrowLeftIcon className="size-4" />}
                    >
                        Back
                    </Button>
                </Navigate>
                <Page.Header.Title>{expense.invoice_no}</Page.Header.Title>
                <Page.Header.Description className="flex items-center gap-2 pt-2 text-xs">
                    {expense.completed_at && !expense.closed_at && (
                        <Badge color="green" variant="outline" size="sm" radius="xl">
                            Completed
                        </Badge>
                    )}
                    {!expense.completed_at && (
                        <Badge color="yellow" variant="outline" size="sm" radius="xl">
                            Pending
                        </Badge>
                    )}
                    {expense.invoice_date && (
                        <span>
                            <Cast.Datetime>{expense.invoice_date}</Cast.Datetime>
                        </span>
                    )}
                </Page.Header.Description>
            </Page.Header>

            <Page.Content split>
                <Page.Content.Main>
                    <Stack>
                        {expense.expense_items && expense.expense_items.length > 0 && (
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">Expense Items</h3>
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Item</Table.Th>
                                            <Table.Th>Quantity</Table.Th>
                                            <Table.Th>Cost</Table.Th>
                                            <Table.Th>Rebate</Table.Th>
                                            <Table.Th>Royalty</Table.Th>
                                            <Table.Th>Price</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {expense.expense_items.map((item) => (
                                            <Table.Tr key={item.id}>
                                                <Table.Td>
                                                    {item.__product_name || item.item || '—'}
                                                </Table.Td>
                                                <Table.Td>{item.quantity}</Table.Td>
                                                <Table.Td>
                                                    <Cast.Currency>{item.cost}</Cast.Currency>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Cast.Currency>{item.rebate}</Cast.Currency>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Cast.Currency>{item.royalty}</Cast.Currency>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Cast.Currency>{item.price}</Cast.Currency>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </div>
                        )}
                    </Stack>
                </Page.Content.Main>
                <Page.Content.Aside>
                    <div className="flex text-center *:flex-1">
                        <div className="space-y-1 text-zinc-950/60">
                            <div className="text-lg font-bold">
                                <Cast.Currency>{expense.__cost}</Cast.Currency>
                            </div>
                            <div className="text-xs uppercase">Total Cost</div>
                        </div>
                        <div className="space-y-1 text-zinc-950/60">
                            <div className="text-lg font-bold">
                                <Cast.Currency>{expense.__rebate}</Cast.Currency>
                            </div>
                            <div className="text-xs uppercase">Total Rebate</div>
                        </div>
                        <div className="space-y-1 text-zinc-950/60">
                            <div className="text-lg font-bold">
                                <Cast.Currency>{expense.__royalty}</Cast.Currency>
                            </div>
                            <div className="text-xs uppercase">Total Royalty</div>
                        </div>
                    </div>

                    <div className="mx-auto flex items-center space-x-2 text-amber-600">
                        <MailWarning className="size-5 shrink-0 text-amber-500" />
                        <div className="max-w-72 text-xs">
                            {itemsLeft} {itemsLeft > 1 ? 'items need' : 'item needs'} to be assigned
                            to {itemsLeft > 1 ? 'products' : 'a product'}.
                        </div>
                    </div>

                    <ActionWell>
                        <ActionWell.Row>
                            <Navigate type="modal" href={route('expenses.destroy', expense.id)}>
                                <Button
                                    disabled={!!expense.completed_at || !completable}
                                    variant="filled"
                                    color="blue"
                                >
                                    Mark as complete
                                </Button>
                            </Navigate>
                        </ActionWell.Row>
                        <ActionWell.Row>
                            <Navigate type="modal" href={route('expenses.destroy', expense.id)}>
                                <Button
                                    variant="light"
                                    color="zinc"
                                    disabled={!!expense.completed_at}
                                >
                                    Change details
                                </Button>
                            </Navigate>
                            <ActionWell.Divider />
                            <Navigate type="modal" href={route('expenses.destroy', expense.id)}>
                                <Button
                                    variant="light"
                                    color="zinc"
                                    disabled={!!expense.completed_at}
                                >
                                    Cancel expense
                                </Button>
                            </Navigate>
                        </ActionWell.Row>
                    </ActionWell>

                    <Stack>
                        <DescriptionList>
                            <DescriptionList.Title>Details</DescriptionList.Title>
                            <DescriptionList.Items>
                                <DescriptionList.Item>
                                    <DescriptionList.Item.Label>
                                        Invoice No
                                    </DescriptionList.Item.Label>
                                    <DescriptionList.Item.Value>
                                        {expense.invoice_no}
                                    </DescriptionList.Item.Value>
                                </DescriptionList.Item>
                                <DescriptionList.Item>
                                    <DescriptionList.Item.Label>
                                        Invoice Date
                                    </DescriptionList.Item.Label>
                                    <DescriptionList.Item.Value>
                                        <Cast.Datetime>{expense.invoice_date}</Cast.Datetime>
                                    </DescriptionList.Item.Value>
                                </DescriptionList.Item>
                                <DescriptionList.Item>
                                    <DescriptionList.Item.Label>
                                        Wholesaler
                                    </DescriptionList.Item.Label>
                                    <DescriptionList.Item.Value>
                                        <Navatar name={expense.__wholesaler_name} />
                                    </DescriptionList.Item.Value>
                                </DescriptionList.Item>
                                <DescriptionList.Item>
                                    <DescriptionList.Item.Label>
                                        Created At
                                    </DescriptionList.Item.Label>
                                    <DescriptionList.Item.Value>
                                        <Cast.Datetime>{expense.created_at}</Cast.Datetime>
                                    </DescriptionList.Item.Value>
                                </DescriptionList.Item>
                            </DescriptionList.Items>
                        </DescriptionList>
                    </Stack>
                </Page.Content.Aside>
            </Page.Content>
        </Page>
    );
};

View.layout = [AppLayout];

export default View;
