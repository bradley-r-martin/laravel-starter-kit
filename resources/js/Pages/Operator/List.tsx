import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { Badge, Button, Group, Text } from '@mantine/core';
import {
    BanIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    MapPinIcon,
    PencilIcon,
    PlusIcon,
    RotateCcwIcon,
    TagIcon,
    TrashIcon,
    XIcon,
} from 'lucide-react';

interface ListProps {
    operators: Paginated<Models.Operator & { territories_count?: number }>;
}

const List: InertiaView<ListProps> = ({ operators }) => {
    const sortOptions = [
        { value: 'name', label: 'Name', icon: TagIcon },
        { value: 'territories_count', label: 'Territories', icon: MapPinIcon },
        { value: 'last_transaction_at', label: 'Last Transaction', icon: ClockIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    const columns: ResourceColumn<Models.Operator>[] = [
        {
            header: 'Name',
            accessor: 'name',
            render: (operator) => <Navatar name={operator.name} />,
        },
        {
            header: 'Email',
            accessor: 'email',
            dataSpan: 'hidden',
            render: (operator) => (
                <Text size="sm" c="dimmed">
                    {operator.email ?? '—'}
                </Text>
            ),
        },
        {
            header: 'Territories',
            accessor: 'territories_count',
            dataSpan: 'hidden',
            render: (operator) => (
                <Badge variant="light" color="blue">
                    {operator.territories_count}
                </Badge>
            ),
        },
        {
            header: 'Last Transaction',
            accessor: 'last_transaction_at',
            dataSpan: 'hidden',
            render: (operator) => (
                <Text size="sm" c="dimmed">
                    <Cast.Datetime
                        format="DD/MM/YYYY"
                        children={operator.last_transaction_at}
                        fallback="—"
                    />
                </Text>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            dataSpan: 'hidden',
            render: (operator) => (
                <Group gap="xs">
                    {operator.suspended_at && (
                        <Badge variant="light" color="orange">
                            Suspended
                        </Badge>
                    )}
                    {operator.closed_at && (
                        <Badge variant="light" color="red">
                            Closed
                        </Badge>
                    )}
                    {!operator.suspended_at && !operator.closed_at && (
                        <Badge variant="light" color="green">
                            Active
                        </Badge>
                    )}
                </Group>
            ),
        },
        {
            header: 'Created',
            accessor: 'created_at',
            dataSpan: 'hidden',
            render: (operator) => (
                <Text size="sm" c="dimmed">
                    <Cast.Datetime
                        format="DD/MM/YYYY"
                        children={operator.created_at}
                        fallback="—"
                    />
                </Text>
            ),
        },
    ];

    return (
        <ResourceList
            headTitle="Operators"
            title="Operators"
            items={operators}
            resource={{ singular: 'operator', plural: 'operators' }}
            rowKey={(operator) => operator.id}
            columns={columns}
            actionsColumnProps={{ width: '180px' }}
            actions={(operator: Models.Operator) => [
                {
                    visible: !operator.closed_at && !operator.suspended_at,
                    icon: PencilIcon,
                    tooltip: 'Edit Operator',
                    href: route('operators.update', operator.id),
                    type: 'modal',
                    color: 'blue',
                },
                {
                    visible: !operator.closed_at && !operator.suspended_at,
                    icon: BanIcon,
                    tooltip: 'Suspend Operator',
                    href: route('operators.suspend', operator.id),
                    type: 'modal',
                    color: 'orange',
                },
                {
                    visible: !operator.closed_at && !operator.suspended_at,
                    icon: XIcon,
                    tooltip: 'Close Operator',
                    href: route('operators.close', operator.id),
                    type: 'modal',
                    color: 'red',
                },
                {
                    visible: !operator.closed_at && !!operator.suspended_at,
                    icon: CheckCircleIcon,
                    tooltip: 'Unsuspend Operator',
                    href: route('operators.unsuspend', operator.id),
                    type: 'modal',
                    color: 'green',
                },
                {
                    visible: !!operator.closed_at,
                    icon: RotateCcwIcon,
                    tooltip: 'Reopen Operator',
                    href: route('operators.reopen', operator.id),
                    type: 'modal',
                    color: 'green',
                },
                {
                    visible: !!operator.closed_at,
                    icon: TrashIcon,
                    tooltip: 'Destroy Operator',
                    href: route('operators.destroy', operator.id),
                    type: 'modal',
                    color: 'red',
                },
            ]}
            emptyState={{
                title: 'No operators found',
                subtitle: 'Create a new operator to get started.',
            }}
            headerAction={
                <Group gap="xs">
                    <Navigate type="modal" href={route('operators.create')}>
                        <Button
                            size="xs"
                            radius="sm"
                            color="zinc"
                            leftSection={<PlusIcon className="size-3" />}
                        >
                            Create
                        </Button>
                    </Navigate>
                </Group>
            }
            filters={
                <Filters>
                    <Filters.Search attribute="operators" className="order-1" />
                    <Filters.Sort data={sortOptions} attribute="operators" />
                    <Filters.Status
                        data={[
                            { value: 'active', label: 'Active' },
                            { value: 'suspended', label: 'Suspended' },
                            { value: 'closed', label: 'Closed' },
                        ]}
                        attribute="operators"
                        className="order-2 flex-1 lg:order-3 lg:ml-auto lg:flex-none"
                    />
                </Filters>
            }
            paginationAttribute="operators"
            getRowTestId={(operator) => `operator-row-${operator.id}`}
        />
    );
};

List.layout = [AppLayout];

export default List;
