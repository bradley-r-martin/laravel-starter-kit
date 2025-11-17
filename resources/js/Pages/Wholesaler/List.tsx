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
    CircleDotIcon,
    PencilIcon,
    PlusIcon,
    RotateCcwIcon,
    TagIcon,
    TrashIcon,
    XIcon,
} from 'lucide-react';

interface Wholesaler {
    id: string;
    name: string;
    closed_at: string | null;
    created_at: string;
}

interface ListProps {
    wholesalers: Paginated<Wholesaler>;
}

const List: InertiaView<ListProps> = (props) => {
    const { wholesalers } = props;

    const sortOptions = [
        { value: 'name', label: 'Name', icon: TagIcon },
        { value: 'status', label: 'Status', icon: CircleDotIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    const columns: ResourceColumn<Wholesaler>[] = [
        {
            header: 'Name',
            accessor: 'name',
            render: (wholesaler) => <Navatar name={wholesaler.name} />,
        },
        {
            header: 'Status',
            accessor: 'status',
            dataSpan: 'hidden',
            render: (wholesaler) => (
                <Group gap="xs">
                    {wholesaler.closed_at && (
                        <Badge variant="light" color="red">
                            Closed
                        </Badge>
                    )}
                    {!wholesaler.closed_at && (
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
            render: (wholesaler) => (
                <Text size="sm" c="dimmed">
                    <Cast.Datetime
                        format="DD/MM/YYYY"
                        children={wholesaler.created_at}
                        fallback="—"
                    />
                </Text>
            ),
        },
    ];

    const actionsColumn: ResourceColumn<Wholesaler> = {
        header: 'Actions',
        accessor: 'actions',
        width: '180px',
        render: (wholesaler) => (
            <Group gap="xs" justify="end">
                {!wholesaler.closed_at && (
                    <>
                        <Tooltip label="Edit Wholesaler" position="left">
                            <Navigate
                                type="modal"
                                href={route('wholesalers.update', wholesaler.id)}
                            >
                                <ActionIcon
                                    data-testid={`wholesaler-row-${wholesaler.id}-edit`}
                                    variant="subtle"
                                    color="blue"
                                    size="md"
                                    radius="xl"
                                >
                                    <PencilIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Close Wholesaler" position="left">
                            <Navigate type="modal" href={route('wholesalers.close', wholesaler.id)}>
                                <ActionIcon
                                    data-testid={`wholesaler-row-${wholesaler.id}-close`}
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
                {wholesaler.closed_at && (
                    <>
                        <Tooltip label="Reopen Wholesaler" position="left">
                            <Navigate
                                type="modal"
                                href={route('wholesalers.reopen', wholesaler.id)}
                            >
                                <ActionIcon
                                    data-testid={`wholesaler-row-${wholesaler.id}-reopen`}
                                    variant="subtle"
                                    color="green"
                                    size="md"
                                    radius="xl"
                                >
                                    <RotateCcwIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Destroy Wholesaler" position="left">
                            <Navigate
                                type="modal"
                                href={route('wholesalers.destroy', wholesaler.id)}
                            >
                                <ActionIcon
                                    data-testid={`wholesaler-row-${wholesaler.id}-destroy`}
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
            headTitle="Wholesalers"
            title="Wholesalers"
            items={wholesalers}
            resource={{ singular: 'wholesaler', plural: 'wholesalers' }}
            rowKey={(wholesaler) => wholesaler.id}
            columns={columns}
            actionsColumn={actionsColumn}
            emptyState={{
                title: 'No wholesalers found',
                subtitle: 'Create a new wholesaler to get started.',
            }}
            headerAction={
                <Group gap="xs">
                    <Navigate type="modal" href={route('wholesalers.create')}>
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
                    <Filters.Search attribute="wholesalers" className="order-1" />
                    <Filters.Sort data={sortOptions} attribute="wholesalers" />
                    <Filters.Status
                        data={[
                            { value: 'active', label: 'Active' },
                            { value: 'closed', label: 'Closed' },
                        ]}
                        attribute="wholesalers"
                        className="order-2 flex-1 lg:order-3 lg:ml-auto lg:flex-none"
                    />
                </Filters>
            }
            paginationAttribute="wholesalers"
            getRowTestId={(wholesaler) => `wholesaler-row-${wholesaler.id}`}
        />
    );
};

List.layout = [AppLayout];

export default List;
