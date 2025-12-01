import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import ResourceList from '@/Components/ResourceList';
import ResourceListAction from '@/Components/ResourceList/ResourceListAction';
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

    return (
        <ResourceList<Models.Route>
            data={routes}
            resource="routes"
            headerProps={{
                title: 'Routes',
                subtitle: `Showing ${routes.total} routes`,
                action: (
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
                ),
                filters: (
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
                ),
            }}
            columns={[
                {
                    name: 'Route',
                    cellProps: {
                        className: 'col-span-full p-3!',
                    },
                    cell: (route) => <Navatar name={route.name} />,
                },
                {
                    name: 'Sites',
                    cell: (route) => (
                        <Text size="sm" c="dimmed">
                            {route.__sites_count}
                        </Text>
                    ),
                },
                {
                    name: 'Status',
                    cell: (route) => (
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
                    name: 'Created',
                    cell: (route) => (
                        <Text size="sm" c="dimmed">
                            <Cast.Datetime
                                format="DD/MM/YYYY"
                                children={route.created_at}
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
                    cell: (route: Models.Route) => (
                        <span className="flex items-center justify-end gap-2">
                            <ResourceListAction
                                visible={!route.closed_at}
                                href={route('routes.update', route.id)}
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
                                    tooltip: 'Edit Route',
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
