import Cast from '@/components/Cast';
import { Empty } from '@/components/Empty';
import Navatar from '@/components/Navatar';
import Navigate from '@/components/Navigate';
import Table from '@/components/Table/Table';
import AppLayout from '@/Layouts/AppLayout';
import Header from '@/Parts/Header';
import { InertiaView, UploadedFile } from '@/types';
import { Asset } from '@/Utilities/Asset';
import { Head } from '@inertiajs/react';
import { ActionIcon, Badge, Button, Group, Text, Tooltip } from '@mantine/core';
import { PencilIcon, RotateCcwIcon, SearchIcon, TrashIcon, XIcon } from 'lucide-react';



interface Product {
    id: string;
    name: string;
    sku: string;
    units: number;
    cost: number;
    price: number;
    rebate: string;
    royalty: string;
    avatar: UploadedFile | null;
    closed_at: string | null;
    __product_type_name: string;
    __manufacturer_name: string;
}

interface ListProps {
    products: Product[];
}

const List: InertiaView<ListProps> = (props) => {
    const { products } = props;
    return (
        <>
            <Head title="Products" />
            <div className="relative z-20 container mx-auto translate-y-3 px-5 lg:pt-10">
                <div className="text-xs text-zinc-500">{products.length} products</div>
            </div>
            <Header
                title="Products"
                action={
                    <Group gap="xs">
                        <ActionIcon variant="transparent" color="zinc" radius="xl" size="lg">
                            <SearchIcon className="size-4" />
                        </ActionIcon>
                        <Navigate type="modal" href={route('products.create')}>
                            <Button size="xs">Create Product</Button>
                        </Navigate>
                    </Group>
                }
            />

            <div className="container mx-auto mt-5 px-3 pb-[800px] lg:px-5">
                {products.length === 0 ? (
                    <Empty
                        title="No products found"
                        subtitle="Create a new product to get started."
                    />
                ) : (
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Thead.Tr>
                                <Table.Th>Product</Table.Th>
                                <Table.Th>SKU</Table.Th>
                                <Table.Th>Type</Table.Th>
                                <Table.Th>Manufacturer</Table.Th>
                                <Table.Th>Price</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th style={{ width: '180px' }}>Actions</Table.Th>
                            </Table.Thead.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {products.map((product) => (
                                <Table.Tbody.Tr
                                    key={product.id}
                                    data-testid={`product-row-${product.id}`}
                                >
                                    <Table.Tbody.Td data-testid={`product-row-${product.id}-name`}>
                                        <Navatar name={product.name} src={Asset(product.avatar)} />
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-span="hidden"
                                        data-testid={`product-row-${product.id}-sku`}
                                    >
                                        <Text size="sm" c="dimmed">
                                            {product.sku}
                                        </Text>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-span="hidden"
                                        data-testid={`product-row-${product.id}-type`}
                                    >
                                        <Navatar name={product.__product_type_name} />
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-span="hidden"
                                        data-testid={`product-row-${product.id}-manufacturer`}
                                    >
                                        <Navatar name={product.__manufacturer_name} />
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-span="hidden"
                                        data-testid={`product-row-${product.id}-price`}
                                    >
                                        <Text size="sm" c="dimmed">
                                            <Cast.Currency children={product.price} fallback="—" />
                                        </Text>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-span="hidden"
                                        data-testid={`product-row-${product.id}-status`}
                                    >
                                        <Group gap="xs">
                                            {product.closed_at && (
                                                <Badge variant="light" color="red">
                                                    Closed
                                                </Badge>
                                            )}
                                            {!product.closed_at && (
                                                <Badge variant="light" color="green">
                                                    Active
                                                </Badge>
                                            )}
                                        </Group>
                                    </Table.Tbody.Td>
                                    <Table.Tbody.Td
                                        data-testid={`product-row-${product.id}-actions`}
                                    >
                                        <Group gap="xs" justify="end">
                                            {!product.closed_at && (
                                                <>
                                                    <Tooltip label="Edit Product" position="left">
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'products.update',
                                                                product.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`product-row-${product.id}-edit`}
                                                                variant="subtle"
                                                                color="blue"
                                                                size="md"
                                                                radius="xl"
                                                            >
                                                                <PencilIcon className="size-4" />
                                                            </ActionIcon>
                                                        </Navigate>
                                                    </Tooltip>

                                                    <Tooltip label="Close Product" position="left">
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'products.close',
                                                                product.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`product-row-${product.id}-close`}
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
                                            {product.closed_at && (
                                                <>
                                                    <Tooltip
                                                        label="Reinstate Product"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'products.reinstate',
                                                                product.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`product-row-${product.id}-reinstate`}
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
                                                        label="Destroy Product"
                                                        position="left"
                                                    >
                                                        <Navigate
                                                            type="modal"
                                                            href={route(
                                                                'products.destroy',
                                                                product.id
                                                            )}
                                                        >
                                                            <ActionIcon
                                                                data-testid={`product-row-${product.id}-destroy`}
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
            </div>
        </>
    );
};

List.layout = [AppLayout];

export default List;
