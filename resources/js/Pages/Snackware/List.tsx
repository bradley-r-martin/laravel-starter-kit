import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { ActionIcon, Badge, Button, Group, Text, Tooltip } from '@mantine/core';
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

    const columns: ResourceColumn<Models.Snackware>[] = [
        {
            header: 'Name',
            accessor: 'name',
            dataSpan: '1',
            render: (snackware) => <Navatar name={snackware.name} />,
        },
        {
            header: 'Type',
            accessor: 'type',
            dataSpan: 'hidden',
            render: (snackware) => (
                <Badge variant="light" color="blue">
                    {snackware.type}
                </Badge>
            ),
        },
        {
            header: 'Products',
            accessor: 'territory',
            dataSpan: 'hidden',
            render: (snackware) => (
                <Text size="sm" c="dimmed">
                    {snackware.__product_count}
                </Text>
            ),
        },
        {
            header: 'Wholesale cost',
            accessor: 'operator',
            dataSpan: 'hidden',
            render: (snackware) => (
                <Text size="sm" c="dimmed">
                    <Cast.Currency children={snackware.__wholesale_from} fallback="—" /> -{' '}
                    <Cast.Currency children={snackware.__wholesale_to} fallback="—" />
                </Text>
            ),
        },
        {
            header: 'Price',
            accessor: 'price',
            dataSpan: 'hidden',
            render: (snackware) => <Text size="sm">${(snackware.price / 100).toFixed(2)}</Text>,
        },
        {
            header: 'Status',
            accessor: 'status',
            dataSpan: 'hidden',
            render: (snackware) => (
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
            header: 'Created',
            accessor: 'created',
            dataSpan: 'hidden',
            render: (snackware) => (
                <Text size="sm" c="dimmed">
                    <Cast.Datetime
                        format="DD/MM/YYYY"
                        children={snackware.created_at}
                        fallback="—"
                    />
                </Text>
            ),
        },
    ];

    const actionsColumn: ResourceColumn<Snackware> = {
        header: 'Actions',
        accessor: 'actions',
        width: '140px',
        render: (snackware) => (
            <Group gap="xs" justify="end">
                {!snackware.closed_at && (
                    <>
                        <Tooltip label="Edit Snackware" position="left">
                            <Navigate type="modal" href={route('snackwares.update', snackware.id)}>
                                <ActionIcon
                                    data-testid={`snackware-row-${snackware.id}-edit`}
                                    variant="subtle"
                                    color="blue"
                                    size="md"
                                    radius="xl"
                                >
                                    <PencilIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Change Products" position="left">
                            <Navigate
                                type="modal"
                                href={route('snackwares.change-products', snackware.id)}
                            >
                                <ActionIcon
                                    data-testid={`snackware-row-${snackware.id}-change-products`}
                                    variant="subtle"
                                    color="violet"
                                    size="md"
                                    radius="xl"
                                >
                                    <Package className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Close Snackware" position="left">
                            <Navigate type="modal" href={route('snackwares.close', snackware.id)}>
                                <ActionIcon
                                    data-testid={`snackware-row-${snackware.id}-close`}
                                    variant="subtle"
                                    color="orange"
                                    size="md"
                                    radius="xl"
                                >
                                    <XIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>
                    </>
                )}
                {snackware.closed_at && (
                    <>
                        <Tooltip label="Reopen Snackware" position="left">
                            <Navigate type="modal" href={route('snackwares.reopen', snackware.id)}>
                                <ActionIcon
                                    data-testid={`snackware-row-${snackware.id}-reopen`}
                                    variant="subtle"
                                    color="green"
                                    size="md"
                                    radius="xl"
                                >
                                    <RotateCcwIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Destroy Snackware" position="left">
                            <Navigate type="modal" href={route('snackwares.destroy', snackware.id)}>
                                <ActionIcon
                                    data-testid={`snackware-row-${snackware.id}-destroy`}
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
            headTitle="Snackwares"
            title="Snackwares"
            items={snackwares}
            resource={{ singular: 'snackware', plural: 'snackwares' }}
            rowKey={(snackware) => snackware.id}
            columns={columns}
            actionsColumn={actionsColumn}
            emptyState={{
                title: 'No snackwares found',
                subtitle: 'Create a new snackware to get started.',
            }}
            headerAction={
                <Group gap="xs">
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
                </Group>
            }
            filters={
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
            }
            paginationAttribute="snackwares"
            getRowTestId={(snackware) => `snackware-row-${snackware.id}`}
        />
    );
};

List.layout = [AppLayout];

export default List;
