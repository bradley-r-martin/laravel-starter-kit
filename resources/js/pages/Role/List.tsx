import Cast from '@/components/Cast';
import { Empty } from '@/components/Empty';
import Navatar from '@/components/Navatar';
import Navigate from '@/components/Navigate';
import { Pagination } from '@/components/Pagination';
import Table from '@/components/Table/Table';
import AppLayout from '@/Layouts/AppLayout';
import Header from '@/Parts/Header';
import { InertiaView, Paginated } from '@/types';
import { Head } from '@inertiajs/react';
import { ActionIcon, Badge, Button, Group, Stack, Text, Tooltip } from '@mantine/core';
import { PencilIcon, RotateCcwIcon, SearchIcon, TrashIcon, XIcon } from 'lucide-react';

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
    return (
        <>
            <Head title="Roles" />

            <div className="relative z-20 container mx-auto translate-y-3 px-5 lg:pt-10">
                <div className="text-xs text-zinc-500">{roles.data.length} roles</div>
            </div>
            <Header
                title="Roles"
                action={
                    <Group gap="xs">
                        <ActionIcon variant="transparent" color="zinc" radius="xl" size="lg">
                            <SearchIcon className="size-4" />
                        </ActionIcon>
                        <Navigate type="modal" href={route('roles.create')}>
                            <Button size="xs">Create Role</Button>
                        </Navigate>
                    </Group>
                }
            />

            <div className="container mx-auto mt-5 px-3 lg:px-5">
                <Stack gap="xl" mb={800}>
                    {roles.data.length === 0 ? (
                        <Empty title="No roles found" />
                    ) : (
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Description</Table.Th>
                                    <Table.Th>Users</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Created</Table.Th>
                                    <Table.Th style={{ width: '100px' }}>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {roles.data.map((role) => (
                                    <Table.Tbody.Tr
                                        key={role.id}
                                        data-testid={`role-row-${role.id}`}
                                    >
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
                                            <Group
                                                gap="xs"
                                                data-testid={`role-row-${role.id}-status`}
                                            >
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
                                            data-testid={`role-row-${role.id}-created`}
                                            data-span="hidden"
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
                                                                href={route(
                                                                    'roles.update',
                                                                    role.id
                                                                )}
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
                                                        <Tooltip
                                                            label="Reopen Role"
                                                            position="left"
                                                        >
                                                            <Navigate
                                                                type="modal"
                                                                href={route(
                                                                    'roles.reopen',
                                                                    role.id
                                                                )}
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

                                                        <Tooltip
                                                            label="Destroy Role"
                                                            position="left"
                                                        >
                                                            <Navigate
                                                                type="modal"
                                                                href={route(
                                                                    'roles.destroy',
                                                                    role.id
                                                                )}
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
                </Stack>
            </div>
        </>
    );
};

List.layout = [AppLayout];

export default List;
