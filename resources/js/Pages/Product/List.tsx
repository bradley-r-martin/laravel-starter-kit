import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated, UploadedFile } from '@/Types';
import { Asset } from '@/Utilities/Asset';
import { ActionIcon, Badge, Button, Group, Text, Tooltip } from '@mantine/core';
import {
    BadgePercent,
    BoxesIcon,
    Building2Icon,
    CircleDotIcon,
    DollarSignIcon,
    HashIcon,
    HeartIcon,
    LayersIcon,
    PencilIcon,
    PiggyBankIcon,
    PlusIcon,
    RotateCcwIcon,
    TrashIcon,
    TypeIcon,
    XIcon,
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    sku: string;
    units: number;
    cost: number;
    price: number;
    rebate: number;
    royalty: number;
    avatar: UploadedFile | null;
    closed_at: string | null;
    __product_type_name: string;
    __manufacturer_name: string;
    __cost_per_unit: number;
}

interface ListProps {
    products: Paginated<Product>;
}

const List: InertiaView<ListProps> = (props) => {
    const { products } = props;

    const sortOptions = [
        { value: 'name', label: 'Name', icon: TypeIcon },
        { value: 'sku', label: 'SKU', icon: HashIcon },
        { value: 'type', label: 'Type', icon: LayersIcon },
        { value: 'manufacturer', label: 'Manufacturer', icon: Building2Icon },
        { value: 'units', label: 'Units', icon: BoxesIcon },
        { value: 'cost', label: 'Cost', icon: PiggyBankIcon },
        { value: 'price', label: 'Price', icon: DollarSignIcon },
        { value: 'rebate', label: 'Rebate', icon: BadgePercent },
        { value: 'royalty', label: 'Royalty', icon: HeartIcon },
        { value: 'created_at', label: 'Created At', icon: CircleDotIcon },
    ];

    const columns: ResourceColumn<Product>[] = [
        {
            header: 'Product',
            accessor: 'name',
            render: (product) => <Navatar name={product.name} src={Asset(product.avatar)} />,
        },
        {
            header: 'SKU',
            accessor: 'sku',
            dataSpan: 'hidden',
            render: (product) => (
                <Text size="sm" c="dimmed">
                    {product.sku}
                </Text>
            ),
        },
        {
            header: 'Type',
            accessor: 'type',
            dataSpan: 'hidden',
            render: (product) => <Navatar name={product.__product_type_name} />,
        },
        {
            header: 'Manufacturer',
            accessor: 'manufacturer',
            dataSpan: 'hidden',
            render: (product) => <Navatar name={product.__manufacturer_name} />,
        },
        {
            header: 'Units',
            accessor: 'units',
            dataSpan: 'hidden',
            render: (product) => (
                <Text size="sm" c="dimmed">
                    {product.units}
                </Text>
            ),
        },
        {
            header: 'Cost',
            accessor: 'cost',
            dataSpan: 'hidden',
            render: (product) => (
                <Text size="sm" c="dimmed">
                    <Cast.Currency children={product.cost} fallback="—" />
                </Text>
            ),
        },
        {
            header: 'Cost per unit',
            accessor: 'cost_per_unit',
            dataSpan: 'hidden',
            render: (product) => (
                <Text size="sm" c="dimmed">
                    <Cast.Currency children={product.__cost_per_unit} fallback="—" />
                </Text>
            ),
        },
        {
            header: 'Price',
            accessor: 'price',
            dataSpan: 'hidden',
            render: (product) => (
                <Text size="sm" c="dimmed">
                    <Cast.Currency children={product.price} fallback="—" />
                </Text>
            ),
        },
        {
            header: 'Rebate',
            accessor: 'rebate',
            dataSpan: 'hidden',
            render: (product) => (
                <Text size="sm" c="dimmed">
                    <Cast.Currency children={product.rebate} fallback="—" />
                </Text>
            ),
        },
        {
            header: 'Royalty',
            accessor: 'royalty',
            dataSpan: 'hidden',
            render: (product) => (
                <Text size="sm" c="dimmed">
                    <Cast.Currency children={product.royalty} fallback="—" />
                </Text>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            dataSpan: 'hidden',
            render: (product) => (
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
            ),
        },
    ];

    const actionsColumn: ResourceColumn<Product> = {
        header: 'Actions',
        accessor: 'actions',
        width: '180px',
        render: (product) => (
            <Group gap="xs" justify="end">
                {!product.closed_at && (
                    <>
                        <Tooltip label="Edit Product" position="left">
                            <Navigate type="modal" href={route('products.update', product.id)}>
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
                            <Navigate type="modal" href={route('products.close', product.id)}>
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
                        <Tooltip label="Reinstate Product" position="left">
                            <Navigate type="modal" href={route('products.reinstate', product.id)}>
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

                        <Tooltip label="Destroy Product" position="left">
                            <Navigate type="modal" href={route('products.destroy', product.id)}>
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
        ),
    };

    return (
        <ResourceList
            headTitle="Products"
            title="Products"
            items={products}
            resource={{ singular: 'product', plural: 'products' }}
            rowKey={(product) => product.id}
            columns={columns}
            actionsColumn={actionsColumn}
            emptyState={{
                title: 'No products found',
                subtitle: 'Create a new product to get started.',
            }}
            headerAction={
                <Navigate type="modal" href={route('products.create')}>
                    <Button
                        size="xs"
                        radius="sm"
                        color="zinc"
                        leftSection={<PlusIcon className="size-3" />}
                    >
                        Create
                    </Button>
                </Navigate>
            }
            filters={
                <Filters>
                    <Filters.Search attribute="products" className="order-1" />
                    <Filters.Sort data={sortOptions} attribute="products" />
                    <Filters.Status
                        data={[
                            { value: 'active', label: 'Active' },
                            { value: 'closed', label: 'Closed' },
                        ]}
                        attribute="products"
                        className="order-2 flex-1 lg:order-3 lg:ml-auto lg:flex-none"
                    />
                </Filters>
            }
            paginationAttribute="products"
            getRowTestId={(product) => `product-row-${product.id}`}
        />
    );
};

List.layout = [AppLayout];

export default List;
