import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import ResourceList from '@/Components/ResourceList';
import ResourceListAction from '@/Components/ResourceList/ResourceListAction';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { Badge, Button, Group, Text } from '@mantine/core';
import {
    CalendarIcon,
    CircleDotIcon,
    FileTextIcon,
    HashIcon,
    PencilIcon,
    PlusIcon,
} from 'lucide-react';

interface ListProps {
    expenses: Paginated<Models.Expense>;
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

    return (
        <ResourceList<Models.Expense>
            data={expenses}
            resource="expenses"
            headerProps={{
                title: 'Expenses',
                subtitle: `Showing ${expenses.total} expenses`,
                action: (
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
                ),
                filters: (
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
                ),
            }}
            columns={[
                {
                    name: 'Invoice',
                    cellProps: {
                        className: 'col-span-full p-3!',
                    },
                    cell: (expense) => (
                        <Text size="sm" fw={500}>
                            {expense.invoice_no}
                        </Text>
                    ),
                },
                {
                    name: 'Date',
                    cell: (expense) => (
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
                    name: 'Wholesaler',
                    cell: (expense) => <Navatar name={expense.__wholesaler_name || '—'} />,
                },
                {
                    name: 'Rebate',
                    cell: (expense) => (
                        <Text size="sm" c="dimmed">
                            <Cast.Currency>{expense.__rebate}</Cast.Currency>
                        </Text>
                    ),
                },
                {
                    name: 'Royalty',
                    cell: (expense) => (
                        <Text size="sm" c="dimmed">
                            <Cast.Currency>{expense.__royalty}</Cast.Currency>
                        </Text>
                    ),
                },
                {
                    name: 'Cost',
                    cell: (expense) => (
                        <Text size="sm" c="dimmed">
                            <Cast.Currency>{expense.__cost}</Cast.Currency>
                        </Text>
                    ),
                },
                {
                    name: 'Status',
                    cell: (expense) => (
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
                {
                    name: 'Actions',
                    cellProps: {
                        'data-title': '',
                        className: 'col-span-full',
                        onClick: (e: React.MouseEvent<HTMLTableCellElement>) => e.stopPropagation(),
                    },
                    cell: (expense: Models.Expense) => (
                        <span className="flex items-center justify-end gap-2">
                            <ResourceListAction
                                visible={true}
                                href={route('expenses.show', expense.id)}
                                type="page"
                                color="blue"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'View',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'subtle',
                                    children: <PencilIcon className="size-4" />,
                                    tooltip: 'View Expense',
                                }}
                            />
                        </span>
                    ),
                },
            ]}
        />
    );
};

List.layout = [AppLayout];

export default List;
