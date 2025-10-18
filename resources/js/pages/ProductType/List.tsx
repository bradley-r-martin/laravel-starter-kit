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

interface ProductType {
    id: string;
    name: string;
    closed_at: string | null;
    created_at: string;
    products_count: number;
}

interface ListProps {
    product_types: Paginated<ProductType>;
}

const List: InertiaView<ListProps> = (props) => {
    const { product_types } = props;
    return (
        <>
            <Head title="Product Types" />
            <div className="relative z-20 container mx-auto translate-y-3 px-5 lg:pt-10">
                <div className="text-xs text-zinc-500">
                    {product_types.data.length} product types
                </div>
            </div>
            <Header
                title="Product Types"
                action={
                    <Group gap="xs">
                        <MobileSearch data={product_types} attribute="product_types" />
                        <Navigate type="modal" href={route('product-types.create')}>
                            <Button size="xs">Create Product Type</Button>
                        </Navigate>
                    </Group>
                }
            />

            <div className="container mx-auto mt-5 px-3 pb-[800px] lg:px-5">
                {product_types.data.length === 0 ? (
                    <Empty
                        title="No product types found"
                        subtitle="Create a new product type to get started."
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
                            {product_types.data.map((productType) => (
                                <Table.Tbody.Tr
                                    key={productType.id}
                                    data-testid={`product-type-row-${productType.id}`}
                                >
                                    <Table.Tbody.Td
                                        data-testid={`product-type-row-${productType.id}-name`}
                                    >
                                        <Navatar name={productType.name} />
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-span="hidden"
                                        data-testid={`product-type-row-${productType.id}-products`}
                                    >
                                        <Text size="sm" c="dimmed">
                                            {productType.products_count}
                                        </Text>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-span="hidden"
                                        data-testid={`product-type-row-${productType.id}-status`}
                                    >
                                        <Group gap="xs">
                                            {productType.closed_at && (
                                                <Badge variant="light" color="red">
                                                    Closed
                                                </Badge>
                                            )}
                                            {!productType.closed_at && (
                                                <Badge variant="light" color="green">
                                                    Active
                                                </Badge>
                                            )}
                                        </Group>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-span="hidden"
                                        data-testid={`product-type-row-${productType.id}-created`}
                                    >
                                        <Text size="sm" c="dimmed">
                                            <Cast.Datetime
                                                format="DD/MM/YYYY"
                                                children={productType.created_at}
                                                fallback="—"
                                            />
                                        </Text>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-testid={`product-type-row-${productType.id}-actions`}
                                    >
                                        <Group gap="xs" justify="end">
                                            {!productType.closed_at && (
                                                <>
                                                    <Tooltip
                                                        label="Edit Product Type"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'product-types.update',
                                                                productType.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`product-type-row-${productType.id}-edit`}
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
                                                        label="Close Product Type"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'product-types.close',
                                                                productType.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`product-type-row-${productType.id}-close`}
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
                                            {productType.closed_at && (
                                                <>
                                                    <Tooltip
                                                        label="Reopen Product Type"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'product-types.reopen',
                                                                productType.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`product-type-row-${productType.id}-reopen`}
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
                                                        label="Destroy Product Type"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'product-types.destroy',
                                                                productType.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`product-type-row-${productType.id}-destroy`}
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
                <Pagination data={product_types} attribute="product_types" />
            </div>
        </>
    );
};

List.layout = [AppLayout];

export default List;
