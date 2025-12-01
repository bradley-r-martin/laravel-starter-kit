import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import ResourceList from '@/Components/ResourceList';
import ResourceListAction from '@/Components/ResourceList/ResourceListAction';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { Badge, Button, Group, Text } from '@mantine/core';
import { CalendarIcon, EyeIcon, PlusIcon } from 'lucide-react';

interface ListProps {
    sites: Paginated<
        Models.Site & {
            territory?: Models.Territory | null;
            operator?: Models.Operator | null;
            route?: Models.Route | null;
        }
    >;
}

const List: InertiaView<ListProps> = (props) => {
    const { sites } = props;
    const sortOptions = [
        { value: 'name', label: 'Name', icon: CalendarIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    return (
        <ResourceList<Models.Site>
            data={sites}
            resource="sites"
            headerProps={{
                title: 'Sites',
                subtitle: `Showing ${sites.total} sites`,
                action: (
                    <Navigate type="modal" href={route('sites.create')}>
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
                        <Filters.Search attribute="sites" className="order-1" />
                        <Filters.Sort data={sortOptions} attribute="sites" />
                        <Filters.Status
                            data={[
                                { value: 'active', label: 'Active' },
                                { value: 'closed', label: 'Closed' },
                            ]}
                            attribute="sites"
                            className="order-2 flex-1 lg:order-3 lg:ml-auto lg:flex-none"
                        />
                    </Filters>
                ),
            }}
            columns={[
                {
                    name: 'Site',
                    cellProps: {
                        className: 'col-span-full p-3!',
                    },
                    cell: (site) => <Navatar name={site.name} />,
                },
                {
                    name: 'Territory',
                    cell: (site) => (
                        <Text size="sm" c="dimmed">
                            {site.territory?.name || '—'}
                        </Text>
                    ),
                },
                {
                    name: 'Operator',
                    cell: (site) => (
                        <Text size="sm" c="dimmed">
                            {site.operator?.name || '—'}
                        </Text>
                    ),
                },
                {
                    name: 'Route',
                    cell: (site) => (
                        <Text size="sm" c="dimmed">
                            {site.route?.name || '—'}
                        </Text>
                    ),
                },
                {
                    name: 'Manager Code',
                    cell: (site) => (
                        <Text size="sm" c="dimmed">
                            {site.manager_code || '—'}
                        </Text>
                    ),
                },
                {
                    name: 'Status',
                    cell: (site) => (
                        <Group gap="xs">
                            {site.closed_at && (
                                <Badge variant="light" color="red">
                                    Closed
                                </Badge>
                            )}
                            {!site.closed_at && (
                                <Badge variant="light" color="green">
                                    Active
                                </Badge>
                            )}
                        </Group>
                    ),
                },
                {
                    name: 'Created',
                    cell: (site) => (
                        <Text size="sm" c="dimmed">
                            <Cast.Datetime
                                format="DD/MM/YYYY"
                                children={site.created_at}
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
                    cell: (site: Models.Site) => (
                        <span className="flex items-center justify-end gap-2">
                            <ResourceListAction
                                visible={true}
                                href={route('sites.show', site.id)}
                                type="page"
                                color="blue"
                                mobileProps={{
                                    variant: 'subtle',
                                    children: 'View',
                                    className: 'col-span-1/2',
                                    fullWidth: true,
                                }}
                                desktopProps={{
                                    radius: 'xl',
                                    variant: 'subtle',
                                    children: <EyeIcon className="size-4" />,
                                    tooltip: 'View Site',
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
