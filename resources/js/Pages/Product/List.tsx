import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import ResourceList from '@/Components/ResourceList';
import ResourceListAction from '@/Components/ResourceList/ResourceListAction';

import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { Badge, Button } from '@mantine/core';
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

    return (
        <ResourceList<Models.Product>
            data={products}
            resource="products"
            headerProps={{
                title: 'Products',
                subtitle: `Showing ${products.data.length} products`,
                action: (
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
                ),
                filters: (
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
                ),
            }}
            columns={[
                {
                    name: 'Product',
                    cellProps: {
                        className: 'col-span-full p-3!',
                    },
                    cell: (product) => <Navatar name={product.name as string} />,
                },
                {
                    name: 'Sku',
                    cell: (product) => product.sku,
                },
                {
                    name: 'Type',
                    cell: (product) => product.__product_type_name,
                },
                {
                    name: 'Manufacturer',
                    cell: (product) => product.__manufacturer_name,
                },
                {
                    name: 'Units',
                    cell: (product) => product.units,
                },
                {
                    name: 'Cost',
                    cell: (product) => <Cast.Currency children={product.cost} fallback="—" />,
                },
                {
                    name: 'Cost per unit',
                    cell: (product) => (
                        <Cast.Currency children={product.__cost_per_unit} fallback="—" />
                    ),
                },
                {
                    name: 'Price',
                    cell: (product) => <Cast.Currency children={product.price} fallback="—" />,
                },
                {
                    name: 'Rebate',
                    cell: (product) => <Cast.Percentage children={product.rebate} fallback="—" />,
                },
                {
                    name: 'Royalty',
                    cell: (product: Models.Product) => (
                        <Cast.Percentage children={product.royalty} fallback="—" />
                    ),
                },
                {
                    name: 'Status',
                    cell: (product) =>
                        product.closed_at ? (
                            <Badge variant="light" color="red">
                                Closed
                            </Badge>
                        ) : (
                            <Badge variant="light" color="green">
                                Active
                            </Badge>
                        ),
                },
                {
                    name: 'Actions',
                    cellProps: {
                        'data-title': '',
                        className: 'col-span-full',
                        onClick: (e: React.MouseEvent<HTMLTableCellElement>) => e.stopPropagation(),
                    },
                    cell: (product: Models.Product) => (
                        <span className="flex items-center justify-end gap-2">
                            <ResourceListAction
                                visible={!product.closed_at}
                                href={route('products.update', product.id)}
                                type="modal"
                                color="blue"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'Edit',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'light',
                                    children: <PencilIcon className="size-4" />,
                                    tooltip: 'Edit Product',
                                }}
                            />
                            <ResourceListAction
                                visible={!product.closed_at}
                                href={route('products.close', product.id)}
                                type="modal"
                                color="red"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'Close',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'light',
                                    children: <XIcon className="size-4" />,
                                    tooltip: 'Close Product',
                                }}
                            />
                            <ResourceListAction
                                visible={!!product.closed_at}
                                href={route('products.destroy', product.id)}
                                type="modal"
                                color="red"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'Close',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'light',
                                    children: <TrashIcon className="size-4" />,
                                    tooltip: 'Destroy Product',
                                }}
                            />
                            <ResourceListAction
                                visible={!!product.closed_at}
                                href={route('products.reinstate', product.id)}
                                type="modal"
                                color="green"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'Reinstate',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'light',
                                    children: <RotateCcwIcon className="size-4" />,
                                    tooltip: 'Reinstate',
                                }}
                            />
                        </span>
                    ),
                },
            ]}
        />
    );
};

List.layout = [AppLayout];

export default List;
