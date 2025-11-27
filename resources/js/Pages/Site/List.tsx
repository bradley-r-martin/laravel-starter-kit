import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { ActionIcon, Badge, Button, Group, Text, Tooltip } from '@mantine/core';
import { CalendarIcon, EyeIcon, PlusIcon } from 'lucide-react';

interface ListProps {
    sites: Paginated<Models.Site & {
        territory?: Models.Territory | null;
        operator?: Models.Operator | null;
        route?: Models.Route | null;
    }>;
}

const List: InertiaView<ListProps> = (props) => {
    const { sites } = props;
    const sortOptions = [
        { value: 'name', label: 'Name', icon: CalendarIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    const columns: ResourceColumn<Models.Site>[] = [
        {
            header: 'Name',
            accessor: 'name',
            dataSpan: '1',
            render: (site) => <Navatar name={site.name} />,
        },
        {
            header: 'Territory',
            accessor: 'territory',
            dataSpan: 'hidden',
            render: (site) => (
                <Text size="sm" c="dimmed">
                    {site.territory?.name || '—'}
                </Text>
            ),
        },
        {
            header: 'Operator',
            accessor: 'operator',
            dataSpan: 'hidden',
            render: (site) => (
                <Text size="sm" c="dimmed">
                    {site.operator?.name || '—'}
                </Text>
            ),
        },
        {
            header: 'Route',
            accessor: 'route',
            dataSpan: 'hidden',
            render: (site) => (
                <Text size="sm" c="dimmed">
                    {site.route?.name || '—'}
                </Text>
            ),
        },
        {
            header: 'Manager Code',
            accessor: 'manager_code',
            dataSpan: 'hidden',
            render: (site) => (
                <Text size="sm" c="dimmed">
                    {site.manager_code || '—'}
                </Text>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            dataSpan: 'hidden',
            render: (site) => (
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
            header: 'Created',
            accessor: 'created',
            dataSpan: 'hidden',
            render: (site) => (
                <Text size="sm" c="dimmed">
                    <Cast.Datetime format="DD/MM/YYYY" children={site.created_at} fallback="—" />
                </Text>
            ),
        },
    ];

    const actionsColumn: ResourceColumn<Site> = {
        header: 'Actions',
        accessor: 'actions',
        width: '120px',
        render: (site) => (
            <Group gap="xs" justify="end">
                <Tooltip label="View Site" position="left">
                    <Navigate type="page" href={route('sites.show', site.id)}>
                        <ActionIcon
                            data-testid={`site-row-${site.id}-view`}
                            variant="subtle"
                            color="blue"
                            size="md"
                            radius="xl"
                        >
                            <EyeIcon className="size-4" />
                        </ActionIcon>
                    </Navigate>
                </Tooltip>
            </Group>
        ),
    };

    return (
        <ResourceList
            headTitle="Sites"
            title="Sites"
            items={sites}
            resource={{ singular: 'site', plural: 'sites' }}
            rowKey={(site) => site.id}
            columns={columns}
            actionsColumn={actionsColumn}
            emptyState={{
                title: 'No sites found',
                subtitle: 'Create a new site to get started.',
            }}
            headerAction={
                <Group gap="xs">
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
                </Group>
            }
            filters={
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
            }
            paginationAttribute="sites"
            getRowTestId={(site) => `site-row-${site.id}`}
        />
    );
};

List.layout = [AppLayout];

export default List;
