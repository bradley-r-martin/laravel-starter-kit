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
    PencilIcon,
    PlusIcon,
    RotateCcwIcon,
    TagIcon,
    TrashIcon,
    UsersIcon,
    XIcon,
} from 'lucide-react';

interface Role {
    id: string;
    name: string;
    description: string | null;
    hidden: boolean;
    closed_at: string | null;
    users_count: number;
    created_at: string;
}

interface ListProps {
    roles: Paginated<Role>;
}

const List: InertiaView<ListProps> = (props) => {
    const { roles } = props;
    const sortOptions = [
        { value: 'name', label: 'Name', icon: TagIcon },
        { value: 'users_count', label: 'Users', icon: UsersIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    const columns: ResourceColumn<Role>[] = [
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

    const actionsColumn: ResourceColumn<Role> = {
        header: 'Actions',
        accessor: 'actions',
        width: '120px',
        render: (role) => (
            <Group gap="xs" justify="end">
                {!role.closed_at && (
                    <>
                        <Tooltip label="Edit Role" position="left">
                            <Navigate type="modal" href={route('roles.update', role.id)}>
                                <ActionIcon
                                    data-testid={`role-row-${role.id}-edit`}
                                    variant="subtle"
                                    color="blue"
                                    size="md"
                                    radius="xl"
                                >
                                    <PencilIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Close Role" position="left">
                            <Navigate type="modal" href={route('roles.close', role.id)}>
                                <ActionIcon
                                    data-testid={`role-row-${role.id}-close`}
                                    variant="subtle"
                                    color="orange"
                                    size="md"
                                    radius="xl"
                                >
                                    <XIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>
                    </>
                )}
                {role.closed_at && (
                    <>
                        <Tooltip label="Reopen Role" position="left">
                            <Navigate type="modal" href={route('roles.reopen', role.id)}>
                                <ActionIcon
                                    data-testid={`role-row-${role.id}-reopen`}
                                    variant="subtle"
                                    color="green"
                                    size="md"
                                    radius="xl"
                                >
                                    <RotateCcwIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Destroy Role" position="left">
                            <Navigate type="modal" href={route('roles.destroy', role.id)}>
                                <ActionIcon
                                    data-testid={`role-row-${role.id}-destroy`}
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
            headTitle="Roles"
            title="Roles"
            items={roles}
            resource={{ singular: 'role', plural: 'roles' }}
            rowKey={(role) => role.id}
            columns={columns}
            actionsColumn={actionsColumn}
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
