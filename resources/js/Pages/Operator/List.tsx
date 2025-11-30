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

    return (
        <ResourceList<Models.Operator>
            data={operators}
            resource="operators"
            headerProps={{
                title: 'Operators',
                subtitle: `Showing ${operators.total} operators`,
                action: (
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
                ),
                filters: (
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
                ),
            }}
            columns={[
                {
                    name: 'Operator',
                    cellProps: {
                        className: 'col-span-full p-3!',
                    },
                    cell: (operator) => <Navatar name={operator.name} />,
                },
                {
                    name: 'Email',
                    cell: (operator) => (
                        <Text size="sm" c="dimmed">
                            {operator.email ?? '—'}
                        </Text>
                    ),
                },
                {
                    name: 'Territories',
                    cell: (operator) => (
                        <Badge variant="light" color="blue">
                            {operator.territories_count}
                        </Badge>
                    ),
                },
                {
                    name: 'Last Transaction',
                    cell: (operator) => (
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
                    name: 'Status',
                    cell: (operator) => (
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
                    name: 'Created',
                    cell: (operator) => (
                        <Text size="sm" c="dimmed">
                            <Cast.Datetime
                                format="DD/MM/YYYY"
                                children={operator.created_at}
                                fallback="—"
                            />
                        </Text>
                    ),
                },
                {
                    name: 'Actions',
                    cellProps: {
                        'data-title': '',
                        className: 'col-span-full',
                        onClick: (e: React.MouseEvent<HTMLTableCellElement>) => e.stopPropagation(),
                    },
                    cell: (operator: Models.Operator) => (
                        <span className="flex items-center justify-end gap-2">
                            <ResourceListAction
                                visible={!operator.closed_at && !operator.suspended_at}
                                href={route('operators.update', operator.id)}
                                type="modal"
                                color="blue"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'Edit',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'subtle',
                                    children: <PencilIcon className="size-4" />,
                                    tooltip: 'Edit Operator',
                                }}
                            />
                            <ResourceListAction
                                visible={!operator.closed_at && !operator.suspended_at}
                                href={route('operators.suspend', operator.id)}
                                type="modal"
                                color="orange"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'Suspend',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'subtle',
                                    children: <BanIcon className="size-4" />,
                                    tooltip: 'Suspend Operator',
                                }}
                            />
                            <ResourceListAction
                                visible={!operator.closed_at && !operator.suspended_at}
                                href={route('operators.close', operator.id)}
                                type="modal"
                                color="red"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'Close',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'subtle',
                                    children: <XIcon className="size-4" />,
                                    tooltip: 'Close Operator',
                                }}
                            />
                            <ResourceListAction
                                visible={!operator.closed_at && !!operator.suspended_at}
                                href={route('operators.unsuspend', operator.id)}
                                type="modal"
                                color="green"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'Unsuspend',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'subtle',
                                    children: <CheckCircleIcon className="size-4" />,
                                    tooltip: 'Unsuspend Operator',
                                }}
                            />
                            <ResourceListAction
                                visible={!!operator.closed_at}
                                href={route('operators.reopen', operator.id)}
                                type="modal"
                                color="green"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'Reopen',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'subtle',
                                    children: <RotateCcwIcon className="size-4" />,
                                    tooltip: 'Reopen Operator',
                                }}
                            />
                            <ResourceListAction
                                visible={!!operator.closed_at}
                                href={route('operators.destroy', operator.id)}
                                type="modal"
                                color="red"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'Destroy',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'subtle',
                                    children: <TrashIcon className="size-4" />,
                                    tooltip: 'Destroy Operator',
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
