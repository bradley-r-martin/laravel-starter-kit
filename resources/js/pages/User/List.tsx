import Cast from '@/components/Cast';
import Navatar from '@/components/Navatar';
import Navigate from '@/components/Navigate';
import { Pagination } from '@/components/Pagination';
import Table from '@/components/Table/Table';
import AppLayout from '@/Layouts/AppLayout';
import BaseLayout from '@/Layouts/BaseLayout';
import Header from '@/Parts/Header';
import { InertiaView, Paginated } from '@/types';
import { Head } from '@inertiajs/react';
import { ActionIcon, Badge, Button, Group, Text, Tooltip } from '@mantine/core';
import {
    BanIcon,
    CheckCircleIcon,
    KeyIcon,
    PencilIcon,
    RotateCcwIcon,
    SearchIcon,
    TrashIcon,
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
    return (
        <>
            <Head title="Users" />
            <div className="relative z-20 container mx-auto translate-y-3 px-5 lg:pt-10">
                <div className="text-xs text-zinc-500">{users.data.length} users</div>
            </div>
            <Header
                title="Users"
                action={
                    <Group gap="xs">
                        <ActionIcon variant="transparent" color="zinc" radius="xl" size="lg">
                            <SearchIcon className="size-4" />
                        </ActionIcon>
                        <Navigate type="modal" href={route('users.create')}>
                            <Button size="xs">Create User</Button>
                        </Navigate>
                    </Group>
                }
            />

            <div className="container mx-auto mt-5 px-3 lg:px-5">
                {users.data.length === 0 ? (
                    <Text c="dimmed" p="xl" ta="center">
                        No users found.
                    </Text>
                ) : (
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Thead.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Role</Table.Th>
                                <Table.Th>Operator</Table.Th>
                                <Table.Th>Last Login</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Created</Table.Th>
                                <Table.Th style={{ width: '180px' }}>Actions</Table.Th>
                            </Table.Thead.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {users.data.map((user) => (
                                <Table.Tbody.Tr key={user.id} data-testid={`user-row-${user.id}`}>
                                    <Table.Tbody.Td data-testid={`user-row-${user.id}-name`}>
                                        <Navatar name={`${user.first_name} ${user.last_name}`} />
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td data-testid={`user-row-${user.id}-email`}>
                                        <Text size="sm">{user.email}</Text>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td data-testid={`user-row-${user.id}-role`}>
                                        <Text c="dimmed" size="sm">
                                            {user.role_name || '—'}
                                        </Text>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td data-testid={`user-row-${user.id}-operator`}>
                                        <Text c="dimmed" size="sm">
                                            {user.operator_name || '—'}
                                        </Text>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td data-testid={`user-row-${user.id}-last-login`}>
                                        <Text size="sm" c="dimmed">
                                            <Cast.Datetime
                                                format="DD/MM/YYYY HH:mm"
                                                children={user.last_login_at}
                                                fallback="—"
                                            />
                                        </Text>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td data-testid={`user-row-${user.id}-status`}>
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
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td data-testid={`user-row-${user.id}-created`}>
                                        <Text size="sm" c="dimmed">
                                            <Cast.Datetime
                                                format="DD/MM/YYYY"
                                                children={user.created_at}
                                                fallback="—"
                                            />
                                        </Text>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td data-testid={`user-row-${user.id}-actions`}>
                                        <Group gap="xs" justify="end">
                                            {!user.closed_at && !user.suspended_at && (
                                                <>
                                                    <Tooltip label="Edit User" position="left">
                                                        <Navigate
                                                            type="modal"
                                                            href={route('users.update', user.id)}
                                                        >
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

                                                    <Tooltip
                                                        label="Change Password"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route('users.password', user.id)}
                                                        >
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
                                                        <Navigate
                                                            type="modal"
                                                            href={route('users.suspend', user.id)}
                                                        >
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
                                                        <Navigate
                                                            type="modal"
                                                            href={route('users.close', user.id)}
                                                        >
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
                                                    <Navigate
                                                        type="modal"
                                                        href={route('users.unsuspend', user.id)}
                                                    >
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
                                                        <Navigate
                                                            type="modal"
                                                            href={route('users.reopen', user.id)}
                                                        >
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

                                                    <Tooltip
                                                        label="Destroy Account"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route('users.destroy', user.id)}
                                                        >
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
                                    </Table.Tbody.Td>
                                </Table.Tbody.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                )}
                <Pagination data={users} attribute="users" />
            </div>
        </>
    );
};

List.layout = [BaseLayout, AppLayout];

export default List;
