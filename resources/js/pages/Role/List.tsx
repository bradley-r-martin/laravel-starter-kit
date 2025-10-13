import Cast from '@/components/Cast';
import Navatar from '@/components/Navatar';
import { Pagination } from '@/components/Pagination';
import AppLayout from '@/Layouts/AppLayout';
import BaseLayout from '@/Layouts/BaseLayout';
import { InertiaView, Paginated } from '@/types';
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
import { PencilIcon, RotateCcwIcon, TrashIcon, XIcon } from 'lucide-react';

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
            <Container size="xl" py="xl">
                <Stack gap="xl">
                    <Group justify="space-between" align="center">
                        <Title order={1}>Roles</Title>
                        <ModalLink href={route('roles.create')}  navigate={false}>
                            <Button>Create Role</Button>
                        </ModalLink>
                    </Group>

                    <Paper shadow="sm" p="xl" radius="md" withBorder>
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
                                            <Table.Th style={{ width: '100px' }}>Actions</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {roles.data.map((role) => (
                                            <Table.Tr
                                                key={role.id}
                                                data-testid={`role-row-${role.id}`}
                                            >
                                                <Table.Td data-testid={`role-row-${role.id}-name`}>
                                                    <Navatar name={role.name} />
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text
                                                        c="dimmed"
                                                        size="sm"
                                                        data-testid={`role-row-${role.id}-description`}
                                                    >
                                                        {role.description || '—'}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge
                                                        variant="light"
                                                        color="blue"
                                                        data-testid={`role-row-${role.id}-users-count`}
                                                    >
                                                        {role.users_count}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>
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
                                                </Table.Td>
                                                <Table.Td
                                                    data-testid={`role-row-${role.id}-created`}
                                                >
                                                    <Text size="sm" c="dimmed">
                                                        <Cast.Datetime
                                                            format="DD/MM/YYYY"
                                                            children={role.created_at}
                                                            fallback="—"
                                                        />
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td
                                                    data-testid={`role-row-${role.id}-actions`}
                                                >
                                                    <Group gap="xs">
                                                        {!role.closed_at && (
                                                            <>
                                                                <Tooltip
                                                                    label="Edit Role"
                                                                    position="left"
                                                                >
                                                                    <ActionIcon
                                                                        data-testid={`role-row-${role.id}-edit`}
                                                                        component={ModalLink}
                                                                        href={route(
                                                                            'roles.update',
                                                                            role.id
                                                                        )}
                                                                         navigate={false}
                                                                        variant="subtle"
                                                                        color="blue"
                                                                        size="md"
                                                                        radius="xl"
                                                                    >
                                                                        <PencilIcon className="size-4" />
                                                                    </ActionIcon>
                                                                </Tooltip>

                                                                <Tooltip
                                                                    label="Close Role"
                                                                    position="left"
                                                                >
                                                                    <ActionIcon
                                                                        data-testid={`role-row-${role.id}-close`}
                                                                        component={ModalLink}
                                                                        href={route(
                                                                            'roles.close',
                                                                            role.id
                                                                        )}
                                                                         navigate={false}
                                                                        variant="subtle"
                                                                        color="orange"
                                                                        size="md"
                                                                        radius="xl"
                                                                    >
                                                                        <XIcon className="size-4" />
                                                                    </ActionIcon>
                                                                </Tooltip>
                                                            </>
                                                        )}
                                                        {role.closed_at && (
                                                            <>
                                                                <Tooltip
                                                                    label="Reopen Role"
                                                                    position="left"
                                                                >
                                                                    <ActionIcon
                                                                        data-testid={`role-row-${role.id}-reopen`}
                                                                        component={ModalLink}
                                                                        href={route(
                                                                            'roles.reopen',
                                                                            role.id
                                                                        )}
                                                                         navigate={false}
                                                                        variant="subtle"
                                                                        color="green"
                                                                        size="md"
                                                                        radius="xl"
                                                                    >
                                                                        <RotateCcwIcon className="size-4" />
                                                                    </ActionIcon>
                                                                </Tooltip>

                                                                <Tooltip
                                                                    label="Destroy Role"
                                                                    position="left"
                                                                >
                                                                    <ActionIcon
                                                                        data-testid={`role-row-${role.id}-destroy`}
                                                                        component={ModalLink}
                                                                        href={route(
                                                                            'roles.destroy',
                                                                            role.id
                                                                        )}
                                                                        navigate={false}
                                                                        variant="subtle"
                                                                        color="red"
                                                                        size="md"
                                                                        radius="xl"
                                                                    >
                                                                        <TrashIcon className="size-4" />
                                                                    </ActionIcon>
                                                                </Tooltip>
                                                            </>
                                                        )}
                                                    </Group>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </Table.ScrollContainer>
                        )}
                        <Pagination data={roles} attribute="roles" />
                    </Paper>
                </Stack>
            </Container>
        </>
    );
}

List.layout = [BaseLayout, AppLayout];
 
export default List;
