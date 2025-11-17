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
    Building2Icon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    KeyIcon,
    MailIcon,
    PencilIcon,
    PlusIcon,
    RotateCcwIcon,
    TrashIcon,
    UserIcon,
    XIcon,
} from 'lucide-react';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role_name: string | null;
    operator_name: string | null;
    last_login_at: string | null;
    closed_at: string | null;
    suspended_at: string | null;
    created_at: string;
}

interface ListProps {
    users: Paginated<User>;
}

const List: InertiaView<ListProps> = (props) => {
    const { users } = props;

    const sortOptions = [
        { value: 'name', label: 'Name', icon: UserIcon },
        { value: 'email', label: 'Email', icon: MailIcon },
        { value: 'role', label: 'Role', icon: KeyIcon },
        { value: 'operator', label: 'Operator', icon: Building2Icon },
        { value: 'last_login_at', label: 'Last Login', icon: ClockIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    const columns: ResourceColumn<User>[] = [
        {
            header: 'Name',
            accessor: 'name',
            render: (user) => <Navatar name={`${user.first_name} ${user.last_name}`} />,
        },
        {
            header: 'Email',
            accessor: 'email',
            dataSpan: 'hidden',
            render: (user) => <Text size="sm">{user.email}</Text>,
        },
        {
            header: 'Role',
            accessor: 'role',
            dataSpan: 'hidden',
            render: (user) => (
                <Text c="dimmed" size="sm">
                    {user.role_name || '—'}
                </Text>
            ),
        },
        {
            header: 'Operator',
            accessor: 'operator',
            dataSpan: 'hidden',
            render: (user) => (
                <Text c="dimmed" size="sm">
                    {user.operator_name || '—'}
                </Text>
            ),
        },
        {
            header: 'Last Login',
            accessor: 'last-login',
            dataSpan: 'hidden',
            render: (user) => (
                <Text size="sm" c="dimmed">
                    <Cast.Datetime
                        format="DD/MM/YYYY HH:mm"
                        children={user.last_login_at}
                        fallback="—"
                    />
                </Text>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            dataSpan: 'hidden',
            render: (user) => (
                <Group gap="xs">
                    {user.suspended_at && (
                        <Badge variant="light" color="orange">
                            Suspended
                        </Badge>
                    )}
                    {user.closed_at && (
                        <Badge variant="light" color="red">
                            Closed
                        </Badge>
                    )}
                    {!user.suspended_at && !user.closed_at && (
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
            render: (user) => (
                <Text size="sm" c="dimmed">
                    <Cast.Datetime format="DD/MM/YYYY" children={user.created_at} fallback="—" />
                </Text>
            ),
        },
    ];

    const actionsColumn: ResourceColumn<User> = {
        header: 'Actions',
        accessor: 'actions',
        width: '180px',
        render: (user) => (
            <Group gap="xs" justify="end">
                {!user.closed_at && !user.suspended_at && (
                    <>
                        <Tooltip label="Edit User" position="left">
                            <Navigate type="modal" href={route('users.update', user.id)}>
                                <ActionIcon
                                    data-testid={`user-row-${user.id}-edit`}
                                    variant="subtle"
                                    color="blue"
                                    size="md"
                                    radius="xl"
                                >
                                    <PencilIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Change Password" position="left">
                            <Navigate type="modal" href={route('users.password', user.id)}>
                                <ActionIcon
                                    data-testid={`user-row-${user.id}-password`}
                                    variant="subtle"
                                    color="yellow"
                                    size="md"
                                    radius="xl"
                                >
                                    <KeyIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Suspend User" position="left">
                            <Navigate type="modal" href={route('users.suspend', user.id)}>
                                <ActionIcon
                                    data-testid={`user-row-${user.id}-suspend`}
                                    variant="subtle"
                                    color="orange"
                                    size="md"
                                    radius="xl"
                                >
                                    <BanIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Close Account" position="left">
                            <Navigate type="modal" href={route('users.close', user.id)}>
                                <ActionIcon
                                    data-testid={`user-row-${user.id}-close`}
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
                {!user.closed_at && user.suspended_at && (
                    <Tooltip label="Unsuspend User" position="left">
                        <Navigate type="modal" href={route('users.unsuspend', user.id)}>
                            <ActionIcon
                                data-testid={`user-row-${user.id}-unsuspend`}
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
                {user.closed_at && (
                    <>
                        <Tooltip label="Reopen Account" position="left">
                            <Navigate type="modal" href={route('users.reopen', user.id)}>
                                <ActionIcon
                                    data-testid={`user-row-${user.id}-reopen`}
                                    variant="subtle"
                                    color="green"
                                    size="md"
                                    radius="xl"
                                >
                                    <RotateCcwIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Destroy Account" position="left">
                            <Navigate type="modal" href={route('users.destroy', user.id)}>
                                <ActionIcon
                                    data-testid={`user-row-${user.id}-destroy`}
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
            headTitle="Users"
            title="Users"
            items={users}
            resource={{ singular: 'user', plural: 'users' }}
            rowKey={(user) => user.id}
            columns={columns}
            actionsColumn={actionsColumn}
            emptyState={{
                title: 'No users found',
                subtitle: 'Create a new user to get started.',
            }}
            headerAction={
                <Group gap="xs">
                    <Navigate type="modal" href={route('users.create')}>
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
                    <Filters.Search attribute="users" className="order-1" />
                    <Filters.Sort data={sortOptions} attribute="users" />
                    <Filters.Status
                        data={[
                            { value: 'active', label: 'Active' },
                            { value: 'suspended', label: 'Suspended' },
                            { value: 'closed', label: 'Closed' },
                        ]}
                        attribute="users"
                        className="order-2 flex-1 lg:order-3 lg:ml-auto lg:flex-none"
                    />
                </Filters>
            }
            paginationAttribute="users"
            getRowTestId={(user) => `user-row-${user.id}`}
        />
    );
};

List.layout = [AppLayout];

export default List;
