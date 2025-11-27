import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { ActionIcon, Badge, Button, Group, Text, Tooltip } from '@mantine/core';
import { CalendarIcon, PencilIcon, PlusIcon } from 'lucide-react';

interface ListProps {
    routes: Paginated<Models.Route>;
}

const List: InertiaView<ListProps> = (props) => {
    const { routes } = props;
    const sortOptions = [
        { value: 'name', label: 'Name', icon: CalendarIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    const columns: ResourceColumn<Models.Route>[] = [
        {
            header: 'Name',
            accessor: 'name',
            dataSpan: '1',
            render: (route) => <Navatar name={route.name} />,
        },
        {
            header: 'Sites',
            accessor: 'sites_count',
            dataSpan: 'hidden',
            render: (route) => (
                <Text size="sm" c="dimmed">
                    {route.__sites_count}
                </Text>
            ),
        },

        {
            header: 'Status',
            accessor: 'status',
            dataSpan: 'hidden',
            render: (route) => (
                <Group gap="xs">
                    {route.closed_at && (
                        <Badge variant="light" color="red">
                            Closed
                        </Badge>
                    )}
                    {!route.closed_at && (
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
            render: (route) => (
                <Text size="sm" c="dimmed">
                    <Cast.Datetime format="DD/MM/YYYY" children={route.created_at} fallback="—" />
                </Text>
            ),
        },
    ];

    const actionsColumn: ResourceColumn<Route> = {
        header: 'Actions',
        accessor: 'actions',
        width: '120px',
        render: (row) => (
            <Group gap="xs" justify="end">
                {!row.closed_at && (
                    <>
                        <Tooltip label="Edit Route" position="left">
                            <Navigate type="modal" href={route('routes.update', row.id)}>
                                <ActionIcon
                                    data-testid={`route-row-${row.id}-edit`}
                                    variant="subtle"
                                    color="blue"
                                    size="md"
                                    radius="xl"
                                >
                                    <PencilIcon className="size-4" />
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
            headTitle="Routes"
            title="Routes"
            items={routes}
            resource={{ singular: 'route', plural: 'routes' }}
            rowKey={(route) => route.id}
            columns={columns}
            actionsColumn={actionsColumn}
            emptyState={{
                title: 'No routes found',
                subtitle: 'Create a new route to get started.',
            }}
            headerAction={
                <Group gap="xs">
                    <Navigate type="modal" href={route('routes.create')}>
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
                    <Filters.Search attribute="routes" className="order-1" />
                    <Filters.Sort data={sortOptions} attribute="routes" />
                    <Filters.Status
                        data={[
                            { value: 'active', label: 'Active' },
                            { value: 'closed', label: 'Closed' },
                        ]}
                        attribute="routes"
                        className="order-2 flex-1 lg:order-3 lg:ml-auto lg:flex-none"
                    />
                </Filters>
            }
            paginationAttribute="routes"
            getRowTestId={(route) => `route-row-${route.id}`}
        />
    );
};

List.layout = [AppLayout];

export default List;
