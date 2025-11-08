import Cast from '@/components/Cast';
import { Empty } from '@/components/Empty';
import Navatar from '@/components/Navatar';
import Navigate from '@/components/Navigate';
import { Pagination } from '@/components/Pagination';
import Filters from '@/components/QueryControls/Filters';
import Table from '@/components/Table/Table';
import AppLayout from '@/Layouts/AppLayout';
import Header from '@/Parts/Header';
import { InertiaView, Paginated } from '@/types';
import { Head } from '@inertiajs/react';
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

    return (
        <>
            <Head title="Roles" />

            <Header
                title="Roles"
                subtitle={<div className="text-xs text-zinc-500">{roles.data.length} roles</div>}
                action={
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
            />
            <div className="container mx-auto mt-5 px-3 pb-[800px] lg:px-5">
                {roles.data.length === 0 ? (
                    <Empty title="No roles found" subtitle="Create a new role to get started." />
                ) : (
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Thead.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Description</Table.Th>
                                <Table.Th>Users</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Created</Table.Th>
                                <Table.Th style={{ width: '120px' }}>Actions</Table.Th>
                            </Table.Thead.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {roles.data.map((role) => (
                                <Table.Tbody.Tr key={role.id} data-testid={`role-row-${role.id}`}>
                                    <Table.Tbody.Td
                                        data-span="1"
                                        data-testid={`role-row-${role.id}-name`}
                                    >
                                        <Navatar name={role.name} />
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td data-span="hidden">
                                        <Text
                                            c="dimmed"
                                            size="sm"
                                            data-testid={`role-row-${role.id}-description`}
                                        >
                                            {role.description || '—'}
                                        </Text>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td data-span="hidden">
                                        <Badge
                                            variant="light"
                                            color="blue"
                                            data-testid={`role-row-${role.id}-users-count`}
                                        >
                                            {role.users_count}
                                        </Badge>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td data-span="hidden">
                                        <Group gap="xs" data-testid={`role-row-${role.id}-status`}>
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
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-span="hidden"
                                        data-testid={`role-row-${role.id}-created`}
                                    >
                                        <Text size="sm" c="dimmed">
                                            <Cast.Datetime
                                                format="DD/MM/YYYY"
                                                children={role.created_at}
                                                fallback="—"
                                            />
                                        </Text>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td data-testid={`role-row-${role.id}-actions`}>
                                        <Group gap="xs" justify="end">
                                            {!role.closed_at && (
                                                <>
                                                    <Tooltip label="Edit Role" position="left">
                                                        <Navigate
                                                            type="modal"
                                                            href={route('roles.update', role.id)}
                                                        >
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
                                                        <Navigate
                                                            type="modal"
                                                            href={route('roles.close', role.id)}
                                                        >
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
                                                        <Navigate
                                                            type="modal"
                                                            href={route('roles.reopen', role.id)}
                                                        >
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
                                                        <Navigate
                                                            type="modal"
                                                            href={route('roles.destroy', role.id)}
                                                        >
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
                                    </Table.Tbody.Td>
                                </Table.Tbody.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                )}
                <Pagination data={roles} attribute="roles" />
            </div>
        </>
    );
};

List.layout = [AppLayout];

export default List;
