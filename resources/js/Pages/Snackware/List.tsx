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
    CalendarIcon,
    Package,
    PencilIcon,
    PlusIcon,
    RotateCcwIcon,
    TagIcon,
    TrashIcon,
    XIcon,
} from 'lucide-react';

interface ListProps {
    snackwares: Paginated<Models.Snackware>;
}

const List: InertiaView<ListProps> = (props) => {
    const { snackwares } = props;
    const sortOptions = [
        { value: 'name', label: 'Name', icon: TagIcon },
        { value: 'type', label: 'Type', icon: TagIcon },
        { value: 'price', label: 'Price', icon: TagIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    return (
        <ResourceList<Models.Snackware>
            data={snackwares}
            resource="snackwares"
            headerProps={{
                title: 'Snackwares',
                subtitle: `Showing ${snackwares.total} snackwares`,
                action: (
                    <Navigate type="modal" href={route('snackwares.create')}>
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
                        <Filters.Search attribute="snackwares" className="order-1" />
                        <Filters.Sort data={sortOptions} attribute="snackwares" />
                        <Filters.Status
                            data={[
                                { value: 'active', label: 'Active' },
                                { value: 'closed', label: 'Closed' },
                            ]}
                            attribute="snackwares"
                            className="order-2 flex-1 lg:order-3 lg:ml-auto lg:flex-none"
                        />
                    </Filters>
                ),
            }}
            columns={[
                {
                    name: 'Snackware',
                    cellProps: {
                        className: 'col-span-full p-3!',
                    },
                    cell: (snackware) => <Navatar name={snackware.name} />,
                },
                {
                    name: 'Type',
                    cell: (snackware) => (
                        <Badge variant="light" color="blue">
                            {snackware.type}
                        </Badge>
                    ),
                },
                {
                    name: 'Products',
                    cell: (snackware) => (
                        <Text size="sm" c="dimmed">
                            {snackware.__product_count}
                        </Text>
                    ),
                },
                {
                    name: 'Wholesale cost',
                    cell: (snackware) => (
                        <Text size="sm" c="dimmed">
                            <Cast.Currency children={snackware.__wholesale_from} fallback="—" /> -{' '}
                            <Cast.Currency children={snackware.__wholesale_to} fallback="—" />
                        </Text>
                    ),
                },
                {
                    name: 'Price',
                    cell: (snackware) => (
                        <Text size="sm">${(snackware.price / 100).toFixed(2)}</Text>
                    ),
                },
                {
                    name: 'Status',
                    cell: (snackware) => (
                        <Group gap="xs">
                            {snackware.closed_at && (
                                <Badge variant="light" color="red">
                                    Closed
                                </Badge>
                            )}
                            {!snackware.closed_at && (
                                <Badge variant="light" color="green">
                                    Active
                                </Badge>
                            )}
                        </Group>
                    ),
                },
                {
                    name: 'Created',
                    cell: (snackware) => (
                        <Text size="sm" c="dimmed">
                            <Cast.Datetime
                                format="DD/MM/YYYY"
                                children={snackware.created_at}
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
                    cell: (snackware: Models.Snackware) => (
                        <span className="flex items-center justify-end gap-2">
                            <ResourceListAction
                                visible={!snackware.closed_at}
                                href={route('snackwares.update', snackware.id)}
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
                                    tooltip: 'Edit Snackware',
                                }}
                            />
                            <ResourceListAction
                                visible={!snackware.closed_at}
                                href={route('snackwares.change-products', snackware.id)}
                                type="modal"
                                color="violet"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'Change Products',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'subtle',
                                    children: <Package className="size-4" />,
                                    tooltip: 'Change Products',
                                }}
                            />
                            <ResourceListAction
                                visible={!snackware.closed_at}
                                href={route('snackwares.close', snackware.id)}
                                type="modal"
                                color="orange"
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
                                    tooltip: 'Close Snackware',
                                }}
                            />
                            <ResourceListAction
                                visible={!!snackware.closed_at}
                                href={route('snackwares.reopen', snackware.id)}
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
                                    tooltip: 'Reopen Snackware',
                                }}
                            />
                            <ResourceListAction
                                visible={!!snackware.closed_at}
                                href={route('snackwares.destroy', snackware.id)}
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
                                    tooltip: 'Destroy Snackware',
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
