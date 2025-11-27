import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { Badge, Button, Group, Text } from '@mantine/core';
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

    return (
        <ResourceList
            headTitle="Routes"
            title="Routes"
            items={routes}
            resource={{ singular: 'route', plural: 'routes' }}
            rowKey={(route) => route.id}
            columns={columns}
            actionsColumnProps={{ width: '120px' }}
            actions={(route: Models.Route) => [
                {
                    visible: !route.closed_at,
                    icon: PencilIcon,
                    tooltip: 'Edit Route',
                    href: route('routes.update', route.id),
                    type: 'modal',
                    color: 'blue',
                },
            ]}
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
