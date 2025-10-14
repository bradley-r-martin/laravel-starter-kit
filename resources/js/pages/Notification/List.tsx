import Cast from '@/components/Cast';
import { Pagination } from '@/components/Pagination';
import PushNotificationToggle from '@/components/push-notification-toggle';
import Table from '@/components/Table/Table';
import usePushNotifications from '@/hooks/usePushNotifications';
import AppLayout from '@/Layouts/AppLayout';
import BaseLayout from '@/Layouts/BaseLayout';
import Header from '@/Parts/Header';
import { InertiaView, Paginated } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ActionIcon, Badge, Button, Group, Stack, Text, Tooltip } from '@mantine/core';
import { CheckCheckIcon, CheckIcon, TrashIcon } from 'lucide-react';

interface Notification {
    id: string;
    type: string;
    data: Record<string, unknown>;
    read_at: string | null;
    created_at: string;
}

interface ListProps {
    notifications: Paginated<Notification>;
    unread_count: number;
}

const List: InertiaView<ListProps> = (props) => {
    const { notifications, unread_count } = props;
    const { isSubscribed, unsubscribe } = usePushNotifications();

    const getNotificationTitle = (notification: Notification): string => {
        // Extract title from data if available
        if (notification.data.title) {
            return String(notification.data.title);
        }

        // Fallback to a generic title based on type
        const typeParts = notification.type.split('\\');
        const className = typeParts[typeParts.length - 1];
        return className.replace(/([A-Z])/g, ' $1').trim();
    };

    const getNotificationMessage = (notification: Notification): string => {
        // Extract message from data if available
        if (notification.data.message) {
            return String(notification.data.message);
        }

        // Return empty string if no message
        return '';
    };

    return (
        <>
            <Head title="Notifications" />

            <div className="relative z-20 container mx-auto translate-y-3 px-5 lg:pt-10">
                <div className="text-xs text-zinc-500">
                    {notifications.data.length} notifications
                </div>
            </div>
            <Header
                title="Notifications"
                action={
                    <Group gap="xs">
                        {unread_count > 0 && (
                            <Button
                                component={Link}
                                href={route('notifications.mark-all-as-read')}
                                method="post"
                                navigate={false}
                                leftSection={<CheckCheckIcon className="size-4" />}
                                variant="light"
                                size="xs"
                            >
                                Mark all as read
                            </Button>
                        )}
                    </Group>
                }
            />

            <div className="container mx-auto mt-5 px-3 lg:px-5">
                <Stack gap="xl" mb={800}>
                    <PushNotificationToggle />
                    {isSubscribed && (
                        <Button
                            variant="outline"
                            size="xs"
                            color="zinc"
                            onClick={() => {
                                unsubscribe();
                            }}
                        >
                            Disable Notifications
                        </Button>
                    )}
                    {notifications.data.length === 0 ? (
                        <Text c="dimmed" p="xl" ta="center">
                            No notifications found.
                        </Text>
                    ) : (
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Thead.Tr>
                                    <Table.Th>Title</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Thead.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {notifications.data.map((notification, index) => (
                                    <Table.Tbody.Tr
                                        key={notification.id}
                                        data-notification-id={notification.id}
                                        style={{
                                            borderBottom:
                                                index < notifications.data.length - 1
                                                    ? '1px solid var(--mantine-color-gray-3)'
                                                    : 'none',
                                            backgroundColor: notification.read_at
                                                ? 'transparent'
                                                : 'var(--mantine-color-blue-0)',
                                        }}
                                    >
                                        <Table.Tbody.Td data-span="2">
                                            <Group gap="sm">
                                                <Text size="sm" fw={500}>
                                                    {getNotificationTitle(notification)}
                                                </Text>
                                                {!notification.read_at && (
                                                    <Badge variant="filled" color="blue" size="sm">
                                                        New
                                                    </Badge>
                                                )}
                                            </Group>
                                            {getNotificationMessage(notification) && (
                                                <Text size="xs" c="dimmed">
                                                    {getNotificationMessage(notification)}
                                                </Text>
                                            )}
                                            <Text size="xs" c="dimmed">
                                                <Cast.Datetime
                                                    format="DD/MM/YYYY HH:mm"
                                                    children={notification.created_at}
                                                />
                                            </Text>
                                        </Table.Tbody.Td>
                                        <Table.Tbody.Td data-span="2">
                                            <Group gap="xs" justify="end">
                                                {!notification.read_at && (
                                                    <Tooltip label="Mark as read" position="left">
                                                        <ActionIcon
                                                            component={Link}
                                                            href={route(
                                                                'notifications.mark-as-read',
                                                                notification.id
                                                            )}
                                                            method="post"
                                                            navigate={false}
                                                            variant="subtle"
                                                            color="green"
                                                            size="md"
                                                            radius="xl"
                                                            aria-label="Mark as read"
                                                        >
                                                            <CheckIcon className="size-4" />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                )}
                                                <Tooltip label="Delete" position="left">
                                                    <ActionIcon
                                                        component={Link}
                                                        href={route(
                                                            'notifications.delete',
                                                            notification.id
                                                        )}
                                                        method="delete"
                                                        navigate={false}
                                                        variant="subtle"
                                                        color="red"
                                                        size="md"
                                                        radius="xl"
                                                        aria-label="Delete"
                                                    >
                                                        <TrashIcon className="size-4" />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Group>
                                        </Table.Tbody.Td>
                                    </Table.Tbody.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    )}

                    <Button
                        component={Link}
                        href={route('notifications.send-sample')}
                        method="post"
                        navigate={false}
                        radius="xl"
                        variant="light"
                        color="gray"
                        size="xs"
                    >
                        Send test notification
                    </Button>
                    <Pagination data={notifications} attribute="notifications" />
                </Stack>
            </div>
        </>
    );
};

List.layout = [BaseLayout, AppLayout];

export default List;
