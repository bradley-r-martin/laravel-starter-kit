import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { Asset } from '@/Utilities/Asset';
import { Badge, Button, Group, Text } from '@mantine/core';
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

interface ListProps {
    products: Paginated<Models.Product>;
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

    const columns: ResourceColumn<Models.Product>[] = [
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

    return (
        <ResourceList
            headTitle="Products"
            title="Products"
            items={products}
            resource={{ singular: 'product', plural: 'products' }}
            rowKey={(product) => product.id}
            columns={columns}
            actionsColumnProps={{ width: '180px' }}
            actions={(product: Models.Product) => [
                {
                    visible: !product.closed_at,
                    icon: PencilIcon,
                    tooltip: 'Edit Product',
                    href: route('products.update', product.id),
                    type: 'modal',
                    color: 'blue',
                },
                {
                    visible: !product.closed_at,
                    icon: XIcon,
                    tooltip: 'Close Product',
                    href: route('products.close', product.id),
                    type: 'modal',
                    color: 'red',
                },
                {
                    visible: !!product.closed_at,
                    icon: RotateCcwIcon,
                    tooltip: 'Reinstate Product',
                    href: route('products.reinstate', product.id),
                    type: 'modal',
                    color: 'green',
                },
                {
                    visible: !!product.closed_at,
                    icon: TrashIcon,
                    tooltip: 'Destroy Product',
                    href: route('products.destroy', product.id),
                    type: 'modal',
                    color: 'red',
                },
            ]}
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
