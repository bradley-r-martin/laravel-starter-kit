import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { ActionIcon, Badge, Button, Group, Text, Tooltip } from '@mantine/core';
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

interface Operator {
    id: string;
    name: string;
    email: string | null;
    territories_count: number;
    last_transaction_at: string | null;
    closed_at: string | null;
    suspended_at: string | null;
    created_at: string;
}

interface ListProps {
    operators: Paginated<Operator>;
}

const List: InertiaView<ListProps> = ({ operators }) => {
    const sortOptions = [
        { value: 'name', label: 'Name', icon: TagIcon },
        { value: 'territories_count', label: 'Territories', icon: MapPinIcon },
        { value: 'last_transaction_at', label: 'Last Transaction', icon: ClockIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    const columns: ResourceColumn<Operator>[] = [
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

    const actionsColumn: ResourceColumn<Operator> = {
        header: 'Actions',
        accessor: 'actions',
        width: '180px',
        render: (operator) => (
            <Group gap="xs" justify="end">
                {!operator.closed_at && !operator.suspended_at && (
                    <>
                        <Tooltip label="Edit Operator" position="left">
                            <Navigate type="modal" href={route('operators.update', operator.id)}>
                                <ActionIcon
                                    data-testid={`operator-row-${operator.id}-edit`}
                                    variant="subtle"
                                    color="blue"
                                    size="md"
                                    radius="xl"
                                >
                                    <PencilIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Suspend Operator" position="left">
                            <Navigate type="modal" href={route('operators.suspend', operator.id)}>
                                <ActionIcon
                                    data-testid={`operator-row-${operator.id}-suspend`}
                                    variant="subtle"
                                    color="orange"
                                    size="md"
                                    radius="xl"
                                >
                                    <BanIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Close Operator" position="left">
                            <Navigate type="modal" href={route('operators.close', operator.id)}>
                                <ActionIcon
                                    data-testid={`operator-row-${operator.id}-close`}
                                    variant="subtle"
                                    color="red"
                                    size="md"
                                    radius="xl"
                                >
                                    <XIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>
                    </>
                )}
                {!operator.closed_at && operator.suspended_at && (
                    <Tooltip label="Unsuspend Operator" position="left">
                        <Navigate type="modal" href={route('operators.unsuspend', operator.id)}>
                            <ActionIcon
                                data-testid={`operator-row-${operator.id}-unsuspend`}
                                variant="subtle"
                                color="green"
                                size="md"
                                radius="xl"
                            >
                                <CheckCircleIcon className="size-4" />
                            </ActionIcon>
                        </Navigate>
                    </Tooltip>
                )}
                {operator.closed_at && (
                    <>
                        <Tooltip label="Reopen Operator" position="left">
                            <Navigate type="modal" href={route('operators.reopen', operator.id)}>
                                <ActionIcon
                                    data-testid={`operator-row-${operator.id}-reopen`}
                                    variant="subtle"
                                    color="green"
                                    size="md"
                                    radius="xl"
                                >
                                    <RotateCcwIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Destroy Operator" position="left">
                            <Navigate type="modal" href={route('operators.destroy', operator.id)}>
                                <ActionIcon
                                    data-testid={`operator-row-${operator.id}-destroy`}
                                    variant="subtle"
                                    color="red"
                                    size="md"
                                    radius="xl"
                                >
                                    <TrashIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>
                    </>
                )}
            </Group>
        ),
    };

    return (
        <ResourceList
            headTitle="Operators"
            title="Operators"
            items={operators}
            resource={{ singular: 'operator', plural: 'operators' }}
            rowKey={(operator) => operator.id}
            columns={columns}
            actionsColumn={actionsColumn}
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
