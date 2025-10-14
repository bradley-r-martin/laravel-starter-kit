import Cast from '@/components/Cast';
import { Pagination } from '@/components/Pagination';
import AppLayout from '@/Layouts/AppLayout';
import BaseLayout from '@/Layouts/BaseLayout';
import { InertiaView, Paginated } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    ActionIcon,
    Badge,
    Button,
    Container,
    Group,
    Paper,
    Stack,
    Text,
    Title,
    Tooltip,
} from '@mantine/core';
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

    const handleMarkAsRead = (notificationId: string) => {
        router.post(
            route('notifications.mark-as-read', notificationId),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const handleMarkAllAsRead = () => {
        router.post(
            route('notifications.mark-all-as-read'),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const handleDelete = (notificationId: string) => {
        router.delete(route('notifications.delete', notificationId), {
            preserveScroll: true,
        });
    };

    const handleSendSample = () => {
        router.post(
            route('notifications.send-sample'),
            {},
            {
                preserveScroll: true,
            }
        );
    };

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
            <Container size="xl" py="xl">
                <Stack gap="xl">
                    <Group justify="space-between" align="center">
                        <Group gap="md">
                            <Title order={1}>Notifications</Title>
                            {unread_count > 0 && (
                                <Badge variant="filled" color="blue" size="lg">
                                    {unread_count} unread
                                </Badge>
                            )}
                        </Group>
                        <Group gap="sm">
                            <Button onClick={handleSendSample} variant="light" color="gray">
                                Send Sample
                            </Button>
                            {unread_count > 0 && (
                                <Button
                                    leftSection={<CheckCheckIcon className="size-4" />}
                                    onClick={handleMarkAllAsRead}
                                    variant="light"
                                >
                                    Mark all as read
                                </Button>
                            )}
                        </Group>
                    </Group>

                    <Paper shadow="sm" radius="md" withBorder>
                        {notifications.data.length === 0 ? (
                            <Text c="dimmed" p="xl" ta="center">
                                No notifications found.
                            </Text>
                        ) : (
                            <Stack gap={0}>
                                {notifications.data.map((notification, index) => (
                                    <Paper
                                        key={notification.id}
                                        p="md"
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
                                        <Group justify="space-between" align="flex-start">
                                            <Stack gap="xs" style={{ flex: 1 }}>
                                                <Group gap="sm">
                                                    <Text size="sm" fw={500}>
                                                        {getNotificationTitle(notification)}
                                                    </Text>
                                                    {!notification.read_at && (
                                                        <Badge
                                                            variant="filled"
                                                            color="blue"
                                                            size="sm"
                                                        >
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
                                            </Stack>
                                            <Group gap="xs">
                                                {!notification.read_at && (
                                                    <Tooltip label="Mark as read" position="left">
                                                        <ActionIcon
                                                            onClick={() =>
                                                                handleMarkAsRead(notification.id)
                                                            }
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
                                                        onClick={() =>
                                                            handleDelete(notification.id)
                                                        }
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
                                        </Group>
                                    </Paper>
                                ))}
                            </Stack>
                        )}
                        <Pagination data={notifications} attribute="notifications" />
                    </Paper>
                </Stack>
            </Container>
        </>
    );
};

List.layout = [BaseLayout, AppLayout];

export default List;
