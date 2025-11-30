import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import ResourceList from '@/Components/ResourceList';
import ResourceListAction from '@/Components/ResourceList/ResourceListAction';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { Badge, Button, Group, Text } from '@mantine/core';
import {
    BoxesIcon,
    CalendarIcon,
    CircleDotIcon,
    PencilIcon,
    PlusIcon,
    RotateCcwIcon,
    TagIcon,
    TrashIcon,
    XIcon,
} from 'lucide-react';

interface ListProps {
    manufacturers: Paginated<Models.Manufacturer & { products_count?: number }>;
}

const List: InertiaView<ListProps> = (props) => {
    const { manufacturers } = props;

    const sortOptions = [
        { value: 'name', label: 'Name', icon: TagIcon },
        { value: 'products_count', label: 'Products', icon: BoxesIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
        { value: 'status', label: 'Status', icon: CircleDotIcon },
    ];

    return (
        <ResourceList<Models.Manufacturer>
            data={manufacturers}
            resource="manufacturers"
            headerProps={{
                title: 'Manufacturers',
                subtitle: `Showing ${manufacturers.total} manufacturers`,
                action: (
                    <Navigate type="modal" href={route('manufacturers.create')}>
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
                        <Filters.Search attribute="manufacturers" className="order-1" />
                        <Filters.Sort data={sortOptions} attribute="manufacturers" />
                        <Filters.Status
                            data={[
                                { value: 'active', label: 'Active' },
                                { value: 'closed', label: 'Closed' },
                            ]}
                            attribute="manufacturers"
                            className="order-2 flex-1 lg:order-3 lg:ml-auto lg:flex-none"
                        />
                    </Filters>
                ),
            }}
            columns={[
                {
                    name: 'Manufacturer',
                    cellProps: {
                        className: 'col-span-full p-3!',
                    },
                    cell: (manufacturer) => <Navatar name={manufacturer.name} />,
                },
                {
                    name: 'Products',
                    cell: (manufacturer) => (
                        <Text size="sm" c="dimmed">
                            {manufacturer.products_count}
                        </Text>
                    ),
                },
                {
                    name: 'Status',
                    cell: (manufacturer) => (
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
                    ),
                },
                {
                    name: 'Created',
                    cell: (manufacturer) => (
                        <Text size="sm" c="dimmed">
                            <Cast.Datetime
                                format="DD/MM/YYYY"
                                children={manufacturer.created_at}
                                fallback="—"
                            />
                        </Text>
                    ),
                },
                {
                    name: 'Actions',
                    cellProps: {
                        'data-title': '',
                        className: 'col-span-full',
                        onClick: (e: React.MouseEvent<HTMLTableCellElement>) => e.stopPropagation(),
                    },
                    cell: (manufacturer: Models.Manufacturer) => (
                        <span className="flex items-center justify-end gap-2">
                            <ResourceListAction
                                visible={!manufacturer.closed_at}
                                href={route('manufacturers.update', manufacturer.id)}
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
                                    variant: 'subtle',
                                    children: <PencilIcon className="size-4" />,
                                    tooltip: 'Edit Manufacturer',
                                }}
                            />
                            <ResourceListAction
                                visible={!manufacturer.closed_at}
                                href={route('manufacturers.close', manufacturer.id)}
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
                                    variant: 'subtle',
                                    children: <XIcon className="size-4" />,
                                    tooltip: 'Close Manufacturer',
                                }}
                            />
                            <ResourceListAction
                                visible={!!manufacturer.closed_at}
                                href={route('manufacturers.reopen', manufacturer.id)}
                                type="modal"
                                color="green"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'Reopen',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'subtle',
                                    children: <RotateCcwIcon className="size-4" />,
                                    tooltip: 'Reopen Manufacturer',
                                }}
                            />
                            <ResourceListAction
                                visible={!!manufacturer.closed_at}
                                href={route('manufacturers.destroy', manufacturer.id)}
                                type="modal"
                                color="red"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'Destroy',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'subtle',
                                    children: <TrashIcon className="size-4" />,
                                    tooltip: 'Destroy Manufacturer',
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
