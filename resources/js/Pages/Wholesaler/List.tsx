import Cast from '@/Components/Cast';
import Navatar from '@/Components/Navatar';
import Navigate from '@/Components/Navigate';
import Filters from '@/Components/QueryControls/Filters';
import { ResourceColumn, ResourceList } from '@/Components/ResourceList';
import AppLayout from '@/Layouts/AppLayout';
import { InertiaView, Paginated } from '@/Types';
import { Badge, Button, Group, Text } from '@mantine/core';
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

interface ListProps {
    wholesalers: Paginated<Models.Wholesaler>;
}

const List: InertiaView<ListProps> = (props) => {
    const { wholesalers } = props;

    const sortOptions = [
        { value: 'name', label: 'Name', icon: TagIcon },
        { value: 'status', label: 'Status', icon: CircleDotIcon },
        { value: 'created_at', label: 'Created At', icon: CalendarIcon },
    ];

    const columns: ResourceColumn<Models.Wholesaler>[] = [
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

    return (
        <ResourceList
            headTitle="Wholesalers"
            title="Wholesalers"
            items={wholesalers}
            resource={{ singular: 'wholesaler', plural: 'wholesalers' }}
            rowKey={(wholesaler) => wholesaler.id}
            columns={columns}
            actionsColumnProps={{ width: '180px' }}
            actions={(wholesaler: Models.Wholesaler) => [
                {
                    visible: !wholesaler.closed_at,
                    icon: PencilIcon,
                    tooltip: 'Edit Wholesaler',
                    href: route('wholesalers.update', wholesaler.id),
                    type: 'modal',
                    color: 'blue',
                },
                {
                    visible: !wholesaler.closed_at,
                    icon: XIcon,
                    tooltip: 'Close Wholesaler',
                    href: route('wholesalers.close', wholesaler.id),
                    type: 'modal',
                    color: 'red',
                },
                {
                    visible: !!wholesaler.closed_at,
                    icon: RotateCcwIcon,
                    tooltip: 'Reopen Wholesaler',
                    href: route('wholesalers.reopen', wholesaler.id),
                    type: 'modal',
                    color: 'green',
                },
                {
                    visible: !!wholesaler.closed_at,
                    icon: TrashIcon,
                    tooltip: 'Destroy Wholesaler',
                    href: route('wholesalers.destroy', wholesaler.id),
                    type: 'modal',
                    color: 'red',
                },
            ]}
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
