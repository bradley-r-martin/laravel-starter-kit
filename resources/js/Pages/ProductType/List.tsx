import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { Badge, Button, Group, Text } from '@mantine/core';
import {
    BoxesIcon,
    CalendarIcon,
    PencilIcon,
    PlusIcon,
    RotateCcwIcon,
    TagIcon,
    TrashIcon,
    XIcon,
} from 'lucide-react';

interface ListProps {
    product_types: Paginated<Models.ProductType & { products_count?: number }>;
}

const List: InertiaView<ListProps> = (props) => {
    const { product_types } = props;

    const sortOptions = [
        { value: 'name', label: 'Name', icon: TagIcon },
        { value: 'products_count', label: 'Products', icon: BoxesIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    const columns: ResourceColumn<Models.ProductType>[] = [
        {
            header: 'Name',
            accessor: 'name',
            render: (productType) => <Navatar name={productType.name} />,
        },
        {
            header: 'Products',
            accessor: 'products',
            dataSpan: 'hidden',
            render: (productType) => (
                <Text size="sm" c="dimmed">
                    {productType.products_count}
                </Text>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            dataSpan: 'hidden',
            render: (productType) => (
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
            ),
        },
        {
            header: 'Created',
            accessor: 'created',
            dataSpan: 'hidden',
            render: (productType) => (
                <Text size="sm" c="dimmed">
                    <Cast.Datetime
                        format="DD/MM/YYYY"
                        children={productType.created_at}
                        fallback="—"
                    />
                </Text>
            ),
        },
    ];

    return (
        <ResourceList
            headTitle="Product Types"
            title="Product Types"
            items={product_types}
            resource={{ singular: 'product-type', plural: 'product types' }}
            rowKey={(productType) => productType.id}
            columns={columns}
            actionsColumnProps={{ width: '180px' }}
            actions={(productType: Models.ProductType) => [
                {
                    visible: !productType.closed_at,
                    icon: PencilIcon,
                    tooltip: 'Edit Product Type',
                    href: route('product-types.update', productType.id),
                    type: 'modal',
                    color: 'blue',
                },
                {
                    visible: !productType.closed_at,
                    icon: XIcon,
                    tooltip: 'Close Product Type',
                    href: route('product-types.close', productType.id),
                    type: 'modal',
                    color: 'red',
                },
                {
                    visible: !!productType.closed_at,
                    icon: RotateCcwIcon,
                    tooltip: 'Reopen Product Type',
                    href: route('product-types.reopen', productType.id),
                    type: 'modal',
                    color: 'green',
                },
                {
                    visible: !!productType.closed_at,
                    icon: TrashIcon,
                    tooltip: 'Destroy Product Type',
                    href: route('product-types.destroy', productType.id),
                    type: 'modal',
                    color: 'red',
                },
            ]}
            emptyState={{
                title: 'No product types found',
                subtitle: 'Create a new product type to get started.',
            }}
            headerAction={
                <Group gap="xs">
                    <Navigate type="modal" href={route('product-types.create')}>
                        <Button
                            size="xs"
                            radius="sm"
                            color="zinc"
                            leftSection={<PlusIcon className="size-3" />}
                        >
                            Create
                        </Button>
                    </Navigate>
                </Group>
            }
            filters={
                <Filters>
                    <Filters.Search attribute="product_types" className="order-1" />
                    <Filters.Sort data={sortOptions} attribute="product_types" />
                    <Filters.Status
                        data={[
                            { value: 'active', label: 'Active' },
                            { value: 'closed', label: 'Closed' },
                        ]}
                        attribute="product_types"
                        className="order-2 flex-1 lg:order-3 lg:ml-auto lg:flex-none"
                    />
                </Filters>
            }
            paginationAttribute="product_types"
            getRowTestId={(productType) => `product-type-row-${productType.id}`}
        />
    );
};

List.layout = [AppLayout];

export default List;
