import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import ResourceList from '@/Components/ResourceList';
import ResourceListAction from '@/Components/ResourceList/ResourceListAction';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { Asset } from '@/Utilities/Asset';
import { Badge, Button, Group, Text } from '@mantine/core';
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

    return (
        <ResourceList<Models.User>
            data={users}
            resource="users"
            headerProps={{
                title: 'Users',
                subtitle: `Showing ${users.total} users`,
                action: (
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
                ),
                filters: (
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
                ),
            }}
            columns={[
                {
                    name: 'User',
                    cellProps: {
                        className: 'col-span-full p-3!',
                    },
                    cell: (user) => (
                        <Navatar
                            name={`${user.first_name} ${user.last_name}`}
                            src={Asset(user.avatar)}
                        />
                    ),
                },
                {
                    name: 'Email',
                    cell: (user) => <Text size="sm">{user.email}</Text>,
                },
                {
                    name: 'Role',
                    cell: (user) => (
                        <Text c="dimmed" size="sm">
                            {user.__role_name}
                        </Text>
                    ),
                },
                {
                    name: 'Operator',
                    cell: (user) => (
                        <Text c="dimmed" size="sm">
                            {user.__operator_name}
                        </Text>
                    ),
                },
                {
                    name: 'Last Login',
                    cell: (user) => (
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
                    name: 'Last Active',
                    cell: (user) => (
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
                    name: 'Status',
                    cell: (user) => (
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
                    name: 'Created',
                    cell: (user) => (
                        <Text size="sm" c="dimmed">
                            <Cast.Datetime
                                format="DD/MM/YYYY"
                                children={user.created_at}
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
                    cell: (user: Models.User) => (
                        <span className="flex items-center justify-end gap-2">
                            <ResourceListAction
                                visible={!user.closed_at && !user.suspended_at}
                                href={route('users.update', user.id)}
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
                                    tooltip: 'Edit User',
                                }}
                            />
                            <ResourceListAction
                                visible={!user.closed_at && !user.suspended_at}
                                href={route('users.password', user.id)}
                                type="modal"
                                color="yellow"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'Change Password',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'subtle',
                                    children: <KeyIcon className="size-4" />,
                                    tooltip: 'Change Password',
                                }}
                            />
                            <ResourceListAction
                                visible={!user.closed_at && !user.suspended_at}
                                href={route('users.suspend', user.id)}
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
                                    tooltip: 'Suspend User',
                                }}
                            />
                            <ResourceListAction
                                visible={!user.closed_at && !user.suspended_at}
                                href={route('users.close', user.id)}
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
                                    tooltip: 'Close Account',
                                }}
                            />
                            <ResourceListAction
                                visible={!user.closed_at && !!user.suspended_at}
                                href={route('users.unsuspend', user.id)}
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
                                    tooltip: 'Unsuspend User',
                                }}
                            />
                            <ResourceListAction
                                visible={!!user.closed_at}
                                href={route('users.reopen', user.id)}
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
                                    tooltip: 'Reopen Account',
                                }}
                            />
                            <ResourceListAction
                                visible={!!user.closed_at}
                                href={route('users.destroy', user.id)}
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
                                    tooltip: 'Destroy Account',
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
