import AppLayout from '@/Layouts/AppLayout';

import ActionWell from '@/Components/ActionWell';
import Cast from '@/Components/Cast';
import DescriptionList from '@/Components/DescriptionList';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import { Page } from '@/Components/Page';
import { InertiaView, UploadedFile } from '@/Types';
import { Badge, Button, Stack } from '@mantine/core';
import { ArrowLeftIcon, ImageIcon, ShieldAlert } from 'lucide-react';

import ExpenseDetailsWorksheet from '@/Features/Expenses/Views/ExpenseDetailsWorksheetView';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export interface ExpenseItem {
    id: string;
    item: string | null;
    quantity: number;
    units: number;
    cost: number;
    rebate: number;
    royalty: number;
    price: number;

    product_id: string | null;

    __product_name: string | null;
}

export interface Expense {
    id: string;
    invoice_no: string;
    invoice_date: string | null;
    pages: UploadedFile[] | null;
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

    const completable = expense.expense_items.every((item) => item.product_id);
    const itemsLeft = expense.expense_items.filter((item) => !item.product_id).length;

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
                    <ExpenseDetailsWorksheet />
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
                    <Stack gap={0}>
                        <ActionWell className="rounded-b-none border-b-0 bg-zinc-100 shadow-inner *:p-4">
                            <div className="flex items-center justify-center space-x-4 overflow-hidden">
                                {(!expense.pages || expense.pages.length === 0) && (
                                    <div className="flex min-h-32 flex-col items-center justify-center gap-2">
                                        <ImageIcon className="size-4 text-slate-400" />
                                        <div className="max-w-xs text-xs text-slate-400">
                                            No invoice availble for preview
                                        </div>
                                    </div>
                                )}
                                <PhotoProvider>
                                    {expense.pages?.map((page, index) => (
                                        <div className="size-32 max-h-full max-w-full" key={index}>
                                            <PhotoView src={`/storage/${page.path}`}>
                                                <img
                                                    src={`/storage/${page.path}`}
                                                    alt={`Page ${index + 1}`}
                                                    className="h-full w-full cursor-zoom-in overflow-hidden rounded object-contain drop-shadow"
                                                />
                                            </PhotoView>
                                        </div>
                                    ))}
                                </PhotoProvider>
                            </div>
                        </ActionWell>

                        <ActionWell className="rounded-t-none">
                            <ActionWell.Row>
                                <Stack>
                                    {!expense.completed_at ? (
                                        <Navigate
                                            type="modal"
                                            href={route('expenses.complete', expense.id)}
                                        >
                                            <Button
                                                disabled={!completable}
                                                variant="filled"
                                                color="blue"
                                            >
                                                Mark as complete
                                            </Button>
                                        </Navigate>
                                    ) : (
                                        <Navigate
                                            type="modal"
                                            href={route('expenses.reopen', expense.id)}
                                        >
                                            <Button variant="filled" color="green">
                                                Reopen expense
                                            </Button>
                                        </Navigate>
                                    )}
                                    {itemsLeft > 0 && !expense.completed_at && (
                                        <div className="mx-auto flex items-center space-x-2 text-amber-600">
                                            <ShieldAlert className="size-5 shrink-0 text-amber-500" />
                                            <div className="max-w-72 text-xs">
                                                {itemsLeft}{' '}
                                                {itemsLeft > 1 ? 'items need' : 'item needs'} to be
                                                assigned to{' '}
                                                {itemsLeft > 1 ? 'products' : 'a product'}.
                                            </div>
                                        </div>
                                    )}
                                </Stack>
                            </ActionWell.Row>
                            <ActionWell.Row>
                                <Navigate type="modal" href={route('expenses.update', expense.id)}>
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
                    </Stack>

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
