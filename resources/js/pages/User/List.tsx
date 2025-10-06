import MainLayout from '@/Layouts/MainLayout';
import { Paginated } from '@/types';
import { Head } from '@inertiajs/react';
import { ModalLink } from '@inertiaui/modal-react';
import {
    ActionIcon,
    Badge,
    Button,
    Container,
    Group,
    Paper,
    Stack,
    Table,
    Text,
    Title,
    Tooltip,
} from '@mantine/core';
import { BanIcon, CheckCircleIcon, PencilIcon, XIcon } from 'lucide-react';

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

interface Props {
    users: Paginated<User>;
}

export default function List({ users }: Props) {
    return (
        <MainLayout>
            <Head title="Users" />
            <Container size="xl" py="xl">
                <Stack gap="xl">
                    <Group justify="space-between" align="center">
                        <Title order={1}>Users</Title>
                        <ModalLink href={route('users.create')} navigate={true}>
                            <Button>Create User</Button>
                        </ModalLink>
                    </Group>

                    <Paper shadow="sm" radius="md" withBorder>
                        {users.data.length === 0 ? (
                            <Text c="dimmed" p="xl" ta="center">
                                No users found.
                            </Text>
                        ) : (
                            <Table.ScrollContainer minWidth={800}>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Name</Table.Th>
                                            <Table.Th>Email</Table.Th>
                                            <Table.Th>Role</Table.Th>
                                            <Table.Th>Operator</Table.Th>
                                            <Table.Th>Last Login</Table.Th>
                                            <Table.Th>Status</Table.Th>
                                            <Table.Th>Created</Table.Th>
                                            <Table.Th style={{ width: '140px' }}>Actions</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {users.data.map((user) => (
                                            <Table.Tr
                                                key={user.id}
                                                data-testid={`user-row-${user.id}`}
                                            >
                                                <Table.Td data-testid={`user-row-${user.id}-name`}>
                                                    <Text fw={500}>
                                                        {user.first_name} {user.last_name}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td data-testid={`user-row-${user.id}-email`}>
                                                    <Text size="sm">{user.email}</Text>
                                                </Table.Td>
                                                <Table.Td data-testid={`user-row-${user.id}-role`}>
                                                    <Text c="dimmed" size="sm">
                                                        {user.role_name || '—'}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td
                                                    data-testid={`user-row-${user.id}-operator`}
                                                >
                                                    <Text c="dimmed" size="sm">
                                                        {user.operator_name || '—'}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td
                                                    data-testid={`user-row-${user.id}-last-login`}
                                                >
                                                    <Text size="sm" c="dimmed">
                                                        {user.last_login_at
                                                            ? new Date(
                                                                  user.last_login_at
                                                              ).toLocaleDateString()
                                                            : '—'}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td
                                                    data-testid={`user-row-${user.id}-status`}
                                                >
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
                                                </Table.Td>
                                                <Table.Td
                                                    data-testid={`user-row-${user.id}-created`}
                                                >
                                                    <Text size="sm" c="dimmed">
                                                        {new Date(
                                                            user.created_at
                                                        ).toLocaleDateString()}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td
                                                    data-testid={`user-row-${user.id}-actions`}
                                                >
                                                    <Group gap="xs">
                                                        {!user.closed_at && !user.suspended_at && (
                                                            <>
                                                                <Tooltip
                                                                    label="Edit User"
                                                                    position="left"
                                                                >
                                                                    <ActionIcon
                                                                        data-testid={`user-row-${user.id}-edit`}
                                                                        component={ModalLink}
                                                                        href={route(
                                                                            'users.update',
                                                                            user.id
                                                                        )}
                                                                        navigate={true}
                                                                        variant="subtle"
                                                                        color="blue"
                                                                        size="md"
                                                                        radius="xl"
                                                                    >
                                                                        <PencilIcon className="size-4" />
                                                                    </ActionIcon>
                                                                </Tooltip>

                                                                <Tooltip
                                                                    label="Suspend User"
                                                                    position="left"
                                                                >
                                                                    <ActionIcon
                                                                        data-testid={`user-row-${user.id}-suspend`}
                                                                        component={ModalLink}
                                                                        href={route(
                                                                            'users.suspend',
                                                                            user.id
                                                                        )}
                                                                        navigate={true}
                                                                        variant="subtle"
                                                                        color="orange"
                                                                        size="md"
                                                                        radius="xl"
                                                                    >
                                                                        <BanIcon className="size-4" />
                                                                    </ActionIcon>
                                                                </Tooltip>

                                                                <Tooltip
                                                                    label="Close Account"
                                                                    position="left"
                                                                >
                                                                    <ActionIcon
                                                                        data-testid={`user-row-${user.id}-close`}
                                                                        component={ModalLink}
                                                                        href={route(
                                                                            'users.close',
                                                                            user.id
                                                                        )}
                                                                        navigate={true}
                                                                        variant="subtle"
                                                                        color="red"
                                                                        size="md"
                                                                        radius="xl"
                                                                    >
                                                                        <XIcon className="size-4" />
                                                                    </ActionIcon>
                                                                </Tooltip>
                                                            </>
                                                        )}
                                                        {!user.closed_at && user.suspended_at && (
                                                            <Tooltip
                                                                label="Unsuspend User"
                                                                position="left"
                                                            >
                                                                <ActionIcon
                                                                    data-testid={`user-row-${user.id}-unsuspend`}
                                                                    component={ModalLink}
                                                                    href={route(
                                                                        'users.unsuspend',
                                                                        user.id
                                                                    )}
                                                                    navigate={true}
                                                                    variant="subtle"
                                                                    color="green"
                                                                    size="md"
                                                                    radius="xl"
                                                                >
                                                                    <CheckCircleIcon className="size-4" />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        )}
                                                    </Group>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </Table.ScrollContainer>
                        )}
                    </Paper>
                </Stack>
            </Container>
        </MainLayout>
    );
}
