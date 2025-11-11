import Cast from '@/components/Cast';
import Navatar from '@/components/Navatar';
import Navigate from '@/components/Navigate';
import Filters from '@/components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/types';
import { ActionIcon, Badge, Button, Group, Text, Tooltip } from '@mantine/core';
import {
    BuildingIcon,
    CalendarIcon,
    CompassIcon,
    MapPinIcon,
    PencilIcon,
    PlusIcon,
    RotateCcwIcon,
    TimerIcon,
    TrashIcon,
    XIcon,
} from 'lucide-react';

interface Territory {
    id: string;
    name: string;
    operator: {
        id: string;
        name: string | null;
    } | null;
    merchant_account: {
        id: string;
        provider: string;
    } | null;
    last_transaction_at: string | null;
    closed_at: string | null;
    created_at: string;
}

interface ListProps {
    territories: Paginated<Territory>;
}

const List: InertiaView<ListProps> = ({ territories }) => {
    const sortOptions = [
        { value: 'name', label: 'Name', icon: MapPinIcon },
        { value: 'operator', label: 'Operator', icon: CompassIcon },
        { value: 'merchant', label: 'Merchant Account', icon: BuildingIcon },
        { value: 'last_transaction', label: 'Last Transaction', icon: TimerIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    const columns: ResourceColumn<Territory>[] = [
        {
            header: 'Name',
            accessor: 'name',
            dataSpan: '1',
            render: (territory) => <Navatar name={territory.name} />,
        },
        {
            header: 'Operator',
            accessor: 'operator',
            dataSpan: 'hidden',
            render: (territory) => (
                <Text size="sm" c="dimmed">
                    {territory.operator?.name ?? '—'}
                </Text>
            ),
        },
        {
            header: 'Merchant Account',
            accessor: 'merchant_account',
            dataSpan: 'hidden',
            render: (territory) =>
                territory.merchant_account ? (
                    <Badge variant="light" color="blue">
                        {territory.merchant_account.provider}
                    </Badge>
                ) : (
                    <Text size="sm" c="dimmed">
                        —
                    </Text>
                ),
        },
        {
            header: 'Last Transaction',
            accessor: 'last_transaction_at',
            dataSpan: 'hidden',
            render: (territory) => (
                <Text size="sm" c="dimmed">
                    <Cast.Datetime
                        format="DD/MM/YYYY HH:mm"
                        children={territory.last_transaction_at}
                        fallback="—"
                    />
                </Text>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            dataSpan: 'hidden',
            render: (territory) => (
                <Badge variant="light" color={territory.closed_at ? 'red' : 'green'}>
                    {territory.closed_at ? 'Closed' : 'Active'}
                </Badge>
            ),
        },
        {
            header: 'Created',
            accessor: 'created_at',
            dataSpan: 'hidden',
            render: (territory) => (
                <Text size="sm" c="dimmed">
                    <Cast.Datetime
                        format="DD/MM/YYYY"
                        children={territory.created_at}
                        fallback="—"
                    />
                </Text>
            ),
        },
    ];

    const actionsColumn: ResourceColumn<Territory> = {
        header: 'Actions',
        accessor: 'actions',
        width: '120px',
        render: (territory) => (
            <Group gap="xs" justify="end">
                {!territory.closed_at && (
                    <>
                        <Tooltip label="Edit Territory" position="left">
                            <Navigate type="modal" href={route('territories.update', territory.id)}>
                                <ActionIcon
                                    data-testid={`territory-row-${territory.id}-edit`}
                                    variant="subtle"
                                    color="blue"
                                    size="md"
                                    radius="xl"
                                >
                                    <PencilIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Close Territory" position="left">
                            <Navigate type="modal" href={route('territories.close', territory.id)}>
                                <ActionIcon
                                    data-testid={`territory-row-${territory.id}-close`}
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
                {territory.closed_at && (
                    <>
                        <Tooltip label="Reopen Territory" position="left">
                            <Navigate type="modal" href={route('territories.reopen', territory.id)}>
                                <ActionIcon
                                    data-testid={`territory-row-${territory.id}-reopen`}
                                    variant="subtle"
                                    color="green"
                                    size="md"
                                    radius="xl"
                                >
                                    <RotateCcwIcon className="size-4" />
                                </ActionIcon>
                            </Navigate>
                        </Tooltip>

                        <Tooltip label="Destroy Territory" position="left">
                            <Navigate
                                type="modal"
                                href={route('territories.destroy', territory.id)}
                            >
                                <ActionIcon
                                    data-testid={`territory-row-${territory.id}-destroy`}
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
            headTitle="Territories"
            title="Territories"
            items={territories}
            resource={{ singular: 'territory', plural: 'territories' }}
            rowKey={(territory) => territory.id}
            columns={columns}
            actionsColumn={actionsColumn}
            emptyState={{
                title: 'No territories found',
                subtitle: 'Create a new territory to get started.',
            }}
            headerAction={
                <Group gap="xs">
                    <Navigate type="modal" href={route('territories.create')}>
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
                    <Filters.Search attribute="territories" className="order-1" />
                    <Filters.Sort data={sortOptions} attribute="territories" />
                    <Filters.Status
                        data={[
                            { value: 'active', label: 'Active' },
                            { value: 'closed', label: 'Closed' },
                        ]}
                        attribute="territories"
                        className="order-2 flex-1 lg:order-3 lg:ml-auto lg:flex-none"
                    />
                </Filters>
            }
            paginationAttribute="territories"
            getRowTestId={(territory) => `territory-row-${territory.id}`}
        />
    );
};

List.layout = [AppLayout];

export default List;
