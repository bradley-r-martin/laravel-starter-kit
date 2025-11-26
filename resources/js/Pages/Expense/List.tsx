import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { ActionIcon, Badge, Button, Group, Text, Tooltip } from '@mantine/core';
import {
    CalendarIcon,
    CircleDotIcon,
    FileTextIcon,
    HashIcon,
    PencilIcon,
    PlusIcon,
} from 'lucide-react';

interface Expense {
    id: string;
    invoice_no: string;
    invoice_date: string | null;
    completed_at: string | null;
    __wholesaler_name: string | null;
    __cost: number;
    __rebate: number;
    __royalty: number;
    created_at: string;
}

interface ListProps {
    expenses: Paginated<Expense>;
}

const List: InertiaView<ListProps> = (props) => {
    const { expenses } = props;

    const sortOptions = [
        { value: 'invoice_date', label: 'Invoice Date', icon: CalendarIcon },
        { value: 'invoice_no', label: 'Invoice No', icon: HashIcon },
        { value: 'wholesaler', label: 'Wholesaler', icon: FileTextIcon },
        { value: 'cost', label: 'Cost', icon: CircleDotIcon },
        { value: 'rebate', label: 'Rebate', icon: CircleDotIcon },
        { value: 'royalty', label: 'Royalty', icon: CircleDotIcon },
        { value: 'completed_at', label: 'Completed At', icon: CalendarIcon },
        { value: 'created_at', label: 'Created At', icon: CircleDotIcon },
    ];

    const columns: ResourceColumn<Expense>[] = [
        {
            header: 'Invoice',
            accessor: 'invoice_no',
            render: (expense) => (
                <Text size="sm" fw={500}>
                    {expense.invoice_no}
                </Text>
            ),
        },
        {
            header: 'Date',
            accessor: 'invoice_date',
            dataSpan: 'hidden',
            render: (expense) => (
                <Text size="sm" c="dimmed">
                    {expense.invoice_date ? (
                        <Cast.Datetime>{expense.invoice_date}</Cast.Datetime>
                    ) : (
                        '—'
                    )}
                </Text>
            ),
        },
        {
            header: 'Wholesaler',
            accessor: 'wholesaler',
            dataSpan: 'hidden',
            render: (expense) => <Navatar name={expense.__wholesaler_name || '—'} />,
        },

        {
            header: 'Rebate',
            accessor: 'rebate',
            dataSpan: 'hidden',
            render: (expense) => (
                <Text size="sm" c="dimmed">
                    <Cast.Currency>{expense.__rebate}</Cast.Currency>
                </Text>
            ),
        },
        {
            header: 'Royalty',
            accessor: 'royalty',
            dataSpan: 'hidden',
            render: (expense) => (
                <Text size="sm" c="dimmed">
                    <Cast.Currency>{expense.__royalty}</Cast.Currency>
                </Text>
            ),
        },
        {
            header: 'Cost',
            accessor: 'cost',
            dataSpan: 'hidden',
            render: (expense) => (
                <Text size="sm" c="dimmed">
                    <Cast.Currency>{expense.__cost}</Cast.Currency>
                </Text>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            dataSpan: 'hidden',
            render: (expense) => (
                <Group gap="xs">
                    {expense.completed_at && (
                        <Badge variant="light" color="green">
                            Completed
                        </Badge>
                    )}
                    {!expense.completed_at && (
                        <Badge variant="light" color="orange">
                            Pending
                        </Badge>
                    )}
                </Group>
            ),
        },
    ];

    const actionsColumn: ResourceColumn<Expense> = {
        header: 'Actions',
        accessor: 'actions',
        width: '180px',
        render: (expense) => (
            <Group gap="xs" justify="end">
                <Tooltip label="View Expense" position="left">
                    <Navigate type="page" href={route('expenses.show', expense.id)}>
                        <ActionIcon
                            data-testid={`expense-row-${expense.id}-view`}
                            variant="subtle"
                            color="blue"
                            size="md"
                            radius="xl"
                        >
                            <PencilIcon className="size-4" />
                        </ActionIcon>
                    </Navigate>
                </Tooltip>
            </Group>
        ),
    };

    return (
        <ResourceList
            headTitle="Expenses"
            title="Expenses"
            items={expenses}
            resource={{ singular: 'expense', plural: 'expenses' }}
            rowKey={(expense) => expense.id}
            columns={columns}
            actionsColumn={actionsColumn}
            emptyState={{
                title: 'No expenses found',
                subtitle: 'Create a new expense to get started.',
            }}
            headerAction={
                <Navigate type="modal" href={route('expenses.create')}>
                    <Button
                        size="xs"
                        radius="sm"
                        color="zinc"
                        leftSection={<PlusIcon className="size-3" />}
                    >
                        Create
                    </Button>
                </Navigate>
            }
            filters={
                <Filters>
                    <Filters.Search attribute="expenses" className="order-1" />
                    <Filters.Sort data={sortOptions} attribute="expenses" />
                    <Filters.Status
                        data={[
                            { value: 'pending', label: 'Pending' },
                            { value: 'completed', label: 'Completed' },
                        ]}
                        attribute="expenses"
                        className="order-2 flex-1 lg:order-3 lg:ml-auto lg:flex-none"
                    />
                </Filters>
            }
            paginationAttribute="expenses"
            getRowTestId={(expense) => `expense-row-${expense.id}`}
        />
    );
};

List.layout = [AppLayout];

export default List;
