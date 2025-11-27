import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { Badge, Button, Group, Text } from '@mantine/core';
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

interface ListProps {
    territories: Paginated<Models.Territory>;
}

const List: InertiaView<ListProps> = ({ territories }) => {
    const sortOptions = [
        { value: 'name', label: 'Name', icon: MapPinIcon },
        { value: 'operator', label: 'Operator', icon: CompassIcon },
        { value: 'merchant', label: 'Merchant Account', icon: BuildingIcon },
        { value: 'last_transaction', label: 'Last Transaction', icon: TimerIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    const columns: ResourceColumn<Models.Territory>[] = [
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
                    {territory.__operator_name ?? '—'}
                </Text>
            ),
        },
        {
            header: 'Merchant Account',
            accessor: 'merchant_account',
            dataSpan: 'hidden',
            render: () => (
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

    return (
        <ResourceList
            headTitle="Territories"
            title="Territories"
            items={territories}
            resource={{ singular: 'territory', plural: 'territories' }}
            rowKey={(territory) => territory.id}
            columns={columns}
            actionsColumnProps={{ width: '120px' }}
            actions={(territory: Models.Territory) => [
                {
                    visible: !territory.closed_at,
                    icon: PencilIcon,
                    tooltip: 'Edit Territory',
                    href: route('territories.update', territory.id),
                    type: 'modal',
                    color: 'blue',
                },
                {
                    visible: !territory.closed_at,
                    icon: XIcon,
                    tooltip: 'Close Territory',
                    href: route('territories.close', territory.id),
                    type: 'modal',
                    color: 'orange',
                },
                {
                    visible: !!territory.closed_at,
                    icon: RotateCcwIcon,
                    tooltip: 'Reopen Territory',
                    href: route('territories.reopen', territory.id),
                    type: 'modal',
                    color: 'green',
                },
                {
                    visible: !!territory.closed_at,
                    icon: TrashIcon,
                    tooltip: 'Destroy Territory',
                    href: route('territories.destroy', territory.id),
                    type: 'modal',
                    color: 'red',
                },
            ]}
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
