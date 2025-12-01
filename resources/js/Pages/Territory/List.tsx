import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import ResourceList from '@/Components/ResourceList';
import ResourceListAction from '@/Components/ResourceList/ResourceListAction';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { Badge, Button, Text } from '@mantine/core';
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

    return (
        <ResourceList<Models.Territory>
            data={territories}
            resource="territories"
            headerProps={{
                title: 'Territories',
                subtitle: `Showing ${territories.total} territories`,
                action: (
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
                ),
                filters: (
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
                ),
            }}
            columns={[
                {
                    name: 'Territory',
                    cellProps: {
                        className: 'col-span-full p-3!',
                    },
                    cell: (territory) => <Navatar name={territory.name} />,
                },
                {
                    name: 'Operator',
                    cell: (territory) => (
                        <Text size="sm" c="dimmed">
                            {territory.__operator_name ?? '—'}
                        </Text>
                    ),
                },
                {
                    name: 'Merchant Account',
                    cell: () => (
                        <Text size="sm" c="dimmed">
                            —
                        </Text>
                    ),
                },
                {
                    name: 'Last Transaction',
                    cell: (territory) => (
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
                    name: 'Status',
                    cell: (territory) => (
                        <Badge variant="light" color={territory.closed_at ? 'red' : 'green'}>
                            {territory.closed_at ? 'Closed' : 'Active'}
                        </Badge>
                    ),
                },
                {
                    name: 'Created',
                    cell: (territory) => (
                        <Text size="sm" c="dimmed">
                            <Cast.Datetime
                                format="DD/MM/YYYY"
                                children={territory.created_at}
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
                    cell: (territory: Models.Territory) => (
                        <span className="flex items-center justify-end gap-2">
                            <ResourceListAction
                                visible={!territory.closed_at}
                                href={route('territories.update', territory.id)}
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
                                    tooltip: 'Edit Territory',
                                }}
                            />
                            <ResourceListAction
                                visible={!territory.closed_at}
                                href={route('territories.close', territory.id)}
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
                                    tooltip: 'Close Territory',
                                }}
                            />
                            <ResourceListAction
                                visible={!!territory.closed_at}
                                href={route('territories.reopen', territory.id)}
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
                                    tooltip: 'Reopen Territory',
                                }}
                            />
                            <ResourceListAction
                                visible={!!territory.closed_at}
                                href={route('territories.destroy', territory.id)}
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
                                    tooltip: 'Destroy Territory',
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
