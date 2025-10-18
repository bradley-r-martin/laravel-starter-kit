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

interface Manufacturer {
    id: string;
    name: string;
    closed_at: string | null;
    created_at: string;
    products_count: number;
}

interface ListProps {
    manufacturers: Paginated<Manufacturer>;
}

const List: InertiaView<ListProps> = (props) => {
    const { manufacturers } = props;
    return (
        <>
            <Head title="Manufacturers" />
            <div className="relative z-20 container mx-auto translate-y-3 px-5 lg:pt-10">
                <div className="text-xs text-zinc-500">
                    {manufacturers.data.length} manufacturers
                </div>
            </div>
            <Header
                title="Manufacturers"
                action={
                    <Group gap="xs">
                        <MobileSearch data={manufacturers} attribute="manufacturers" />
                        <Navigate type="modal" href={route('manufacturers.create')}>
                            <Button size="xs">Create Manufacturer</Button>
                        </Navigate>
                    </Group>
                }
            />

            <div className="container mx-auto mt-5 px-3 pb-[800px] lg:px-5">
                {manufacturers.data.length === 0 ? (
                    <Empty
                        title="No manufacturers found"
                        subtitle="Create a new manufacturer to get started."
                    />
                ) : (
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Thead.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Products</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Created</Table.Th>
                                <Table.Th style={{ width: '180px' }}>Actions</Table.Th>
                            </Table.Thead.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {manufacturers.data.map((manufacturer) => (
                                <Table.Tbody.Tr
                                    key={manufacturer.id}
                                    data-testid={`manufacturer-row-${manufacturer.id}`}
                                >
                                    <Table.Tbody.Td
                                        data-testid={`manufacturer-row-${manufacturer.id}-name`}
                                    >
                                        <Navatar name={manufacturer.name} />
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-span="hidden"
                                        data-testid={`manufacturer-row-${manufacturer.id}-products`}
                                    >
                                        <Text size="sm" c="dimmed">
                                            {manufacturer.products_count}
                                        </Text>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-span="hidden"
                                        data-testid={`manufacturer-row-${manufacturer.id}-status`}
                                    >
                                        <Group gap="xs">
                                            {manufacturer.closed_at && (
                                                <Badge variant="light" color="red">
                                                    Closed
                                                </Badge>
                                            )}
                                            {!manufacturer.closed_at && (
                                                <Badge variant="light" color="green">
                                                    Active
                                                </Badge>
                                            )}
                                        </Group>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-span="hidden"
                                        data-testid={`manufacturer-row-${manufacturer.id}-created`}
                                    >
                                        <Text size="sm" c="dimmed">
                                            <Cast.Datetime
                                                format="DD/MM/YYYY"
                                                children={manufacturer.created_at}
                                                fallback="—"
                                            />
                                        </Text>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-testid={`manufacturer-row-${manufacturer.id}-actions`}
                                    >
                                        <Group gap="xs" justify="end">
                                            {!manufacturer.closed_at && (
                                                <>
                                                    <Tooltip
                                                        label="Edit Manufacturer"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'manufacturers.update',
                                                                manufacturer.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`manufacturer-row-${manufacturer.id}-edit`}
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
                                                        label="Close Manufacturer"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'manufacturers.close',
                                                                manufacturer.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`manufacturer-row-${manufacturer.id}-close`}
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
                                            {manufacturer.closed_at && (
                                                <>
                                                    <Tooltip
                                                        label="Reopen Manufacturer"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'manufacturers.reopen',
                                                                manufacturer.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`manufacturer-row-${manufacturer.id}-reopen`}
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
                                                        label="Destroy Manufacturer"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'manufacturers.destroy',
                                                                manufacturer.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`manufacturer-row-${manufacturer.id}-destroy`}
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
                <Pagination data={manufacturers} attribute="manufacturers" />
            </div>
        </>
    );
};

List.layout = [AppLayout];

export default List;
