import Cast from '@/components/Cast';
import { Empty } from '@/components/Empty';
import MobileSearch from '@/components/MobileSearch';
import Navatar from '@/components/Navatar';
import Navigate from '@/components/Navigate';
import { Pagination } from '@/components/Pagination';
import Table from '@/components/Table/Table';
import AppLayout from '@/Layouts/AppLayout';
import Header from '@/Parts/Header';
import { InertiaView, Paginated } from '@/types';
import { Head } from '@inertiajs/react';
import { ActionIcon, Badge, Button, Group, Text, Tooltip } from '@mantine/core';
import { PencilIcon, RotateCcwIcon, TrashIcon, XIcon } from 'lucide-react';

interface Wholesaler {
    id: string;
    name: string;
    closed_at: string | null;
    created_at: string;
}

interface ListProps {
    wholesalers: Paginated<Wholesaler>;
}

const List: InertiaView<ListProps> = (props) => {
    const { wholesalers } = props;
    return (
        <>
            <Head title="Wholesalers" />
            <div className="relative z-20 container mx-auto translate-y-3 px-5 lg:pt-10">
                <div className="text-xs text-zinc-500">{wholesalers.data.length} wholesalers</div>
            </div>
            <Header
                title="Wholesalers"
                action={
                    <Group gap="xs">
                        <MobileSearch data={wholesalers} attribute="wholesalers" />
                        <Navigate type="modal" href={route('wholesalers.create')}>
                            <Button size="xs">Create Wholesaler</Button>
                        </Navigate>
                    </Group>
                }
            />

            <div className="container mx-auto mt-5 px-3 pb-[800px] lg:px-5">
                {wholesalers.data.length === 0 ? (
                    <Empty
                        title="No wholesalers found"
                        subtitle="Create a new wholesaler to get started."
                    />
                ) : (
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Thead.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Created</Table.Th>
                                <Table.Th style={{ width: '180px' }}>Actions</Table.Th>
                            </Table.Thead.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {wholesalers.data.map((wholesaler) => (
                                <Table.Tbody.Tr
                                    key={wholesaler.id}
                                    data-testid={`wholesaler-row-${wholesaler.id}`}
                                >
                                    <Table.Tbody.Td
                                        data-testid={`wholesaler-row-${wholesaler.id}-name`}
                                    >
                                        <Navatar name={wholesaler.name} />
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-span="hidden"
                                        data-testid={`wholesaler-row-${wholesaler.id}-status`}
                                    >
                                        <Group gap="xs">
                                            {wholesaler.closed_at && (
                                                <Badge variant="light" color="red">
                                                    Closed
                                                </Badge>
                                            )}
                                            {!wholesaler.closed_at && (
                                                <Badge variant="light" color="green">
                                                    Active
                                                </Badge>
                                            )}
                                        </Group>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-span="hidden"
                                        data-testid={`wholesaler-row-${wholesaler.id}-created`}
                                    >
                                        <Text size="sm" c="dimmed">
                                            <Cast.Datetime
                                                format="DD/MM/YYYY"
                                                children={wholesaler.created_at}
                                                fallback="—"
                                            />
                                        </Text>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-testid={`wholesaler-row-${wholesaler.id}-actions`}
                                    >
                                        <Group gap="xs" justify="end">
                                            {!wholesaler.closed_at && (
                                                <>
                                                    <Tooltip
                                                        label="Edit Wholesaler"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'wholesalers.update',
                                                                wholesaler.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`wholesaler-row-${wholesaler.id}-edit`}
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
                                                        label="Close Wholesaler"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'wholesalers.close',
                                                                wholesaler.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`wholesaler-row-${wholesaler.id}-close`}
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
                                            {wholesaler.closed_at && (
                                                <>
                                                    <Tooltip
                                                        label="Reopen Wholesaler"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'wholesalers.reopen',
                                                                wholesaler.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`wholesaler-row-${wholesaler.id}-reopen`}
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
                                                        label="Destroy Wholesaler"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'wholesalers.destroy',
                                                                wholesaler.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`wholesaler-row-${wholesaler.id}-destroy`}
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
                <Pagination data={wholesalers} attribute="wholesalers" />
            </div>
        </>
    );
};

List.layout = [AppLayout];

export default List;
