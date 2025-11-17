import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { ActionIcon, Badge, Button, Group, Text, Tooltip } from '@mantine/core';
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

    const sortOptions = [
        { value: 'name', label: 'Name', icon: TagIcon },
        { value: 'products_count', label: 'Products', icon: BoxesIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    const columns: ResourceColumn<ProductType>[] = [
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

    const actionsColumn: ResourceColumn<ProductType> = {
        header: 'Actions',
        accessor: 'actions',
        width: '180px',
        render: (productType) => (
            <Group gap="xs" justify="end">
                {!productType.closed_at && (
                    <>
                        <Tooltip label="Edit Product Type" position="left">
                            <Navigate
                                type="modal"
                                href={route('product-types.update', productType.id)}
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

                        <Tooltip label="Close Product Type" position="left">
                            <Navigate
                                type="modal"
                                href={route('product-types.close', productType.id)}
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
                        <Tooltip label="Reopen Product Type" position="left">
                            <Navigate
                                type="modal"
                                href={route('product-types.reopen', productType.id)}
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

                        <Tooltip label="Destroy Product Type" position="left">
                            <Navigate
                                type="modal"
                                href={route('product-types.destroy', productType.id)}
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
        ),
    };

    return (
        <ResourceList
            headTitle="Product Types"
            title="Product Types"
            items={product_types}
            resource={{ singular: 'product-type', plural: 'product types' }}
            rowKey={(productType) => productType.id}
            columns={columns}
            actionsColumn={actionsColumn}
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
