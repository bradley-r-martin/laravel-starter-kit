import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { Badge, Button, Group, Text } from '@mantine/core';
import {
    CalendarIcon,
    PencilIcon,
    PlusIcon,
    RotateCcwIcon,
    TagIcon,
    TrashIcon,
    UsersIcon,
    XIcon,
} from 'lucide-react';

interface ListProps {
    roles: Paginated<Models.Role & { users_count?: number }>;
}

const List: InertiaView<ListProps> = (props) => {
    const { roles } = props;
    const sortOptions = [
        { value: 'name', label: 'Name', icon: TagIcon },
        { value: 'users_count', label: 'Users', icon: UsersIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    const columns: ResourceColumn<Models.Role>[] = [
        {
            header: 'Name',
            accessor: 'name',
            dataSpan: '1',
            render: (role) => <Navatar name={role.name} />,
        },
        {
            header: 'Description',
            accessor: 'description',
            dataSpan: 'hidden',
            render: (role) => (
                <Text c="dimmed" size="sm">
                    {role.description || '—'}
                </Text>
            ),
        },
        {
            header: 'Users',
            accessor: 'users',
            dataSpan: 'hidden',
            render: (role) => (
                <Badge variant="light" color="blue">
                    {role.users_count}
                </Badge>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            dataSpan: 'hidden',
            render: (role) => (
                <Group gap="xs">
                    {role.hidden && (
                        <Badge variant="light" color="gray">
                            Hidden
                        </Badge>
                    )}
                    {role.closed_at && (
                        <Badge variant="light" color="red">
                            Closed
                        </Badge>
                    )}
                    {!role.hidden && !role.closed_at && (
                        <Badge variant="light" color="green">
                            Active
                        </Badge>
                    )}
                </Group>
            ),
        },
        {
            header: 'Created',
            accessor: 'created',
            dataSpan: 'hidden',
            render: (role) => (
                <Text size="sm" c="dimmed">
                    <Cast.Datetime format="DD/MM/YYYY" children={role.created_at} fallback="—" />
                </Text>
            ),
        },
    ];

    return (
        <ResourceList
            headTitle="Roles"
            title="Roles"
            items={roles}
            resource={{ singular: 'role', plural: 'roles' }}
            rowKey={(role) => role.id}
            columns={columns}
            actionsColumnProps={{ width: '120px' }}
            actions={(role: Models.Role) => [
                {
                    visible: !role.closed_at,
                    icon: PencilIcon,
                    tooltip: 'Edit Role',
                    href: route('roles.update', role.id),
                    type: 'modal',
                    color: 'blue',
                },
                {
                    visible: !role.closed_at,
                    icon: XIcon,
                    tooltip: 'Close Role',
                    href: route('roles.close', role.id),
                    type: 'modal',
                    color: 'orange',
                },
                {
                    visible: !!role.closed_at,
                    icon: RotateCcwIcon,
                    tooltip: 'Reopen Role',
                    href: route('roles.reopen', role.id),
                    type: 'modal',
                    color: 'green',
                },
                {
                    visible: !!role.closed_at,
                    icon: TrashIcon,
                    tooltip: 'Destroy Role',
                    href: route('roles.destroy', role.id),
                    type: 'modal',
                    color: 'red',
                },
            ]}
            emptyState={{
                title: 'No roles found',
                subtitle: 'Create a new role to get started.',
            }}
            headerAction={
                <Group gap="xs">
                    <Navigate type="modal" href={route('roles.create')}>
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
                    <Filters.Search attribute="roles" className="order-1" />
                    <Filters.Sort data={sortOptions} attribute="roles" />
                    <Filters.Status
                        data={[
                            { value: 'active', label: 'Active' },
                            { value: 'hidden', label: 'Hidden' },
                            { value: 'closed', label: 'Closed' },
                        ]}
                        attribute="roles"
                        className="order-2 flex-1 lg:order-3 lg:ml-auto lg:flex-none"
                    />
                </Filters>
            }
            paginationAttribute="roles"
            getRowTestId={(role) => `role-row-${role.id}`}
        />
    );
};

List.layout = [AppLayout];

export default List;
