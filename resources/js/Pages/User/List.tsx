import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { Asset } from '@/Utilities/Asset';
import {  Badge, Button, Group, Text } from '@mantine/core';
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

interface ListProps {
    users: Paginated<Models.User>;
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

    const columns: ResourceColumn<Models.User>[] = [
        {
            header: 'Name',
            accessor: 'name',
            render: (user) => (
                <Navatar name={`${user.first_name} ${user.last_name}`} src={Asset(user.avatar)} />
            ),
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
                    {user.__role_name}
                </Text>
            ),
        },
        {
            header: 'Operator',
            accessor: 'operator',
            dataSpan: 'hidden',
            render: (user) => (
                <Text c="dimmed" size="sm">
                    {user.__operator_name}
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
                        children={user.__last_login_at}
                        fallback="—"
                    />
                </Text>
            ),
        },
        {
            header: 'Last Active',
            accessor: 'last-activity',
            dataSpan: 'hidden',
            render: (user) => (
                <Text size="sm" c="dimmed">
                    <Cast.Datetime
                        format="DD/MM/YYYY HH:mm"
                        children={user.__last_active_at}
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

    return (
        <ResourceList
            headTitle="Users"
            title="Users"
            items={users}
            resource={{ singular: 'user', plural: 'users' }}
            rowKey={(user) => user.id}
            columns={columns}
            actionsColumnProps={{ width: '180px' }}
            actions={(user: Models.User)=>[
                {
                    visible: !user.closed_at && !user.suspended_at,
                    icon: PencilIcon,
                    tooltip: 'Edit User',
                    href: route('users.update', user.id),
                    type: 'modal',
                    color: 'blue',
                },
                {
                    visible: !user.closed_at && !user.suspended_at,
                    icon: KeyIcon,
                    tooltip: 'Change Password',
                    href: route('users.password', user.id),
                    type: 'modal',
                    color: 'yellow',
                },
                {
                    visible: !user.closed_at && !user.suspended_at,
                    icon: BanIcon,
                    tooltip: 'Suspend User',
                    href: route('users.suspend', user.id),
                    type: 'modal',
                    color: 'orange',
                },
                {
                    visible: !user.closed_at && !user.suspended_at,
                    icon: XIcon,
                    tooltip: 'Close Account',
                    href: route('users.close', user.id),
                    type: 'modal',
                    color: 'red',
                },
                {
                    visible: !user.closed_at && !!user.suspended_at,
                    icon: CheckCircleIcon,
                    tooltip: 'Unsuspend User',
                    href: route('users.unsuspend', user.id),
                    type: 'modal',
                    color: 'green',
                },
                {
                    visible: !!user.closed_at,
                    icon: RotateCcwIcon,
                    tooltip: 'Reopen Account',
                    href: route('users.reopen', user.id),
                    type: 'modal',
                    color: 'green',
                },
                {
                    visible: !!user.closed_at,
                    icon: TrashIcon,
                    tooltip: 'Destroy Account',
                    href: route('users.destroy', user.id),
                    type: 'modal',
                    color: 'red',
                }
            ]}
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
