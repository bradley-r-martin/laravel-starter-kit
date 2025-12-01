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

    return (
        <ResourceList<Models.Role>
            data={roles}
            resource="roles"
            headerProps={{
                title: 'Roles',
                subtitle: `Showing ${roles.total} roles`,
                action: (
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
                ),
                filters: (
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
                ),
            }}
            columns={[
                {
                    name: 'Role',
                    cellProps: {
                        className: 'col-span-full p-3!',
                    },
                    cell: (role) => <Navatar name={role.name} />,
                },
                {
                    name: 'Description',
                    cell: (role) => (
                        <Text c="dimmed" size="sm">
                            {role.description || '—'}
                        </Text>
                    ),
                },
                {
                    name: 'Users',
                    cell: (role) => (
                        <Badge variant="light" color="blue">
                            {role.users_count}
                        </Badge>
                    ),
                },
                {
                    name: 'Status',
                    cell: (role) => (
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
                    name: 'Created',
                    cell: (role) => (
                        <Text size="sm" c="dimmed">
                            <Cast.Datetime
                                format="DD/MM/YYYY"
                                children={role.created_at}
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
                    cell: (role: Models.Role) => (
                        <span className="flex items-center justify-end gap-2">
                            <ResourceListAction
                                visible={!role.closed_at}
                                href={route('roles.update', role.id)}
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
                                    tooltip: 'Edit Role',
                                }}
                            />
                            <ResourceListAction
                                visible={!role.closed_at}
                                href={route('roles.close', role.id)}
                                type="modal"
                                color="orange"
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
                                    tooltip: 'Close Role',
                                }}
                            />
                            <ResourceListAction
                                visible={!!role.closed_at}
                                href={route('roles.reopen', role.id)}
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
                                    tooltip: 'Reopen Role',
                                }}
                            />
                            <ResourceListAction
                                visible={!!role.closed_at}
                                href={route('roles.destroy', role.id)}
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
                                    tooltip: 'Destroy Role',
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
