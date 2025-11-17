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
    CircleDotIcon,
    PencilIcon,
    PlusIcon,
    RotateCcwIcon,
    TagIcon,
    TrashIcon,
    XIcon,
} from 'lucide-react';

interface Manufacturer {
    id: string;
    name: string;
    closed_at: string | null;
    created_at: string;
    products_count: number;
}

interface ListProps {
    manufacturers: Paginated<Manufacturer>;
}

const List: InertiaView<ListProps> = (props) => {
    const { manufacturers } = props;

    const sortOptions = [
        { value: 'name', label: 'Name', icon: TagIcon },
        { value: 'products_count', label: 'Products', icon: BoxesIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
        { value: 'status', label: 'Status', icon: CircleDotIcon },
    ];

    const columns: ResourceColumn<Manufacturer>[] = [
        {
            header: 'Name',
            accessor: 'name',
            render: (manufacturer) => <Navatar name={manufacturer.name} />,
        },
        {
            header: 'Products',
            accessor: 'products',
            dataSpan: 'hidden',
            render: (manufacturer) => (
                <Text size="sm" c="dimmed">
                    {manufacturer.products_count}
                </Text>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            dataSpan: 'hidden',
            render: (manufacturer) => (
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
            header: 'Created',
            accessor: 'created',
            dataSpan: 'hidden',
            render: (manufacturer) => (
                <Text size="sm" c="dimmed">
                    <Cast.Datetime
                        format="DD/MM/YYYY"
                        children={manufacturer.created_at}
                        fallback="—"
                    />
                </Text>
            ),
        },
    ];

    const actionsColumn: ResourceColumn<Manufacturer> = {
        header: 'Actions',
        accessor: 'actions',
        width: '180px',
        render: (manufacturer) => (
            <Group gap="xs" justify="end">
                {!manufacturer.closed_at && (
                    <>
                        <Tooltip label="Edit Manufacturer" position="left">
                            <Navigate
                                type="modal"
                                href={route('manufacturers.update', manufacturer.id)}
                            >
                                <ActionIcon
                                    data-testid={`manufacturer-row-${manufacturer.id}-edit`}
                                    variant="subtle"
                                    color="blue"
                                    size="md"
                                    radius="xl"
                                >
                                    <PencilIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Close Manufacturer" position="left">
                            <Navigate
                                type="modal"
                                href={route('manufacturers.close', manufacturer.id)}
                            >
                                <ActionIcon
                                    data-testid={`manufacturer-row-${manufacturer.id}-close`}
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
                {manufacturer.closed_at && (
                    <>
                        <Tooltip label="Reopen Manufacturer" position="left">
                            <Navigate
                                type="modal"
                                href={route('manufacturers.reopen', manufacturer.id)}
                            >
                                <ActionIcon
                                    data-testid={`manufacturer-row-${manufacturer.id}-reopen`}
                                    variant="subtle"
                                    color="green"
                                    size="md"
                                    radius="xl"
                                >
                                    <RotateCcwIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Destroy Manufacturer" position="left">
                            <Navigate
                                type="modal"
                                href={route('manufacturers.destroy', manufacturer.id)}
                            >
                                <ActionIcon
                                    data-testid={`manufacturer-row-${manufacturer.id}-destroy`}
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
            headTitle="Manufacturers"
            title="Manufacturers"
            items={manufacturers}
            resource={{ singular: 'manufacturer', plural: 'manufacturers' }}
            rowKey={(manufacturer) => manufacturer.id}
            columns={columns}
            actionsColumn={actionsColumn}
            emptyState={{
                title: 'No manufacturers found',
                subtitle: 'Create a new manufacturer to get started.',
            }}
            headerAction={
                <Group gap="xs">
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
                </Group>
            }
            filters={
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
            }
            paginationAttribute="manufacturers"
            getRowTestId={(manufacturer) => `manufacturer-row-${manufacturer.id}`}
        />
    );
};

List.layout = [AppLayout];

export default List;
