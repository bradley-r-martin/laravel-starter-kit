import MainLayout from '@/Layouts/MainLayout';
import { Paginated } from '@/types';
import { Head } from '@inertiajs/react';
import { Badge, Container, Group, Paper, Stack, Table, Text, Title } from '@mantine/core';

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
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {users.data.map((user) => (
                                            <Table.Tr key={user.id}>
                                                <Table.Td>
                                                    <Text fw={500}>
                                                        {user.first_name} {user.last_name}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text size="sm">{user.email}</Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text c="dimmed" size="sm">
                                                        {user.role_name || '—'}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text c="dimmed" size="sm">
                                                        {user.operator_name || '—'}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text size="sm" c="dimmed">
                                                        {user.last_login_at
                                                            ? new Date(
                                                                  user.last_login_at
                                                              ).toLocaleDateString()
                                                            : '—'}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td>
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
                                                <Table.Td>
                                                    <Text size="sm" c="dimmed">
                                                        {new Date(
                                                            user.created_at
                                                        ).toLocaleDateString()}
                                                    </Text>
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
