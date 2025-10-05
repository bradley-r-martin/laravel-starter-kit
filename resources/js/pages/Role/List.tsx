import { Paginated } from '@/types';
import { Head } from '@inertiajs/react';
import { ModalLink } from '@inertiaui/modal-react';
import { Badge, Button, Container, Group, Paper, Stack, Table, Text, Title } from '@mantine/core';

interface Role {
    id: string;
    name: string;
    description: string | null;
    hidden: boolean;
    closed_at: string | null;
    users_count: number;
    created_at: string;
}

interface Props {
    roles: Paginated<Role>;
}

export default function List({ roles }: Props) {
    return (
        <>
            <Head title="Roles" />
            <Container size="xl" py="xl">
                <Stack gap="xl">
                    <Group justify="space-between" align="center">
                        <Title order={1}>Roles</Title>
                        <ModalLink href={route('roles.create')} navigate={true}>
                            <Button>Create Role</Button>
                        </ModalLink>
                    </Group>

                    <Paper shadow="sm" radius="md" withBorder>
                        {roles.data.length === 0 ? (
                            <Text c="dimmed" p="xl" ta="center">
                                No roles found. Create your first role to get started.
                            </Text>
                        ) : (
                            <Table.ScrollContainer minWidth={500}>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Name</Table.Th>
                                            <Table.Th>Description</Table.Th>
                                            <Table.Th>Users</Table.Th>
                                            <Table.Th>Status</Table.Th>
                                            <Table.Th>Created</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {roles.data.map((role) => (
                                            <Table.Tr key={role.id}>
                                                <Table.Td>
                                                    <Text fw={500}>{role.name}</Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text c="dimmed" size="sm">
                                                        {role.description || '—'}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge variant="light" color="blue">
                                                        {role.users_count}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>
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
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text size="sm" c="dimmed">
                                                        {new Date(
                                                            role.created_at
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
        </>
    );
}
