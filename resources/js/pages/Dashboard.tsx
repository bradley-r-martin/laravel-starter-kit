import { Head } from '@inertiajs/react';
import { Container, Paper, Stack, Text, Title } from '@mantine/core';
import { FunctionComponent } from 'react';

interface DashboardProps {}

const Dashboard: FunctionComponent<DashboardProps> = () => {
    return (
        <>
            <Head title="Dashboard" />
            <Container size="xl" py="xl">
                <Stack gap="xl">
                    <Stack gap="xs">
                        <Title order={1}>Dashboard</Title>
                        <Text size="sm" c="dimmed">
                            Welcome to your dashboard
                        </Text>
                    </Stack>

                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <Text>You are now logged in and viewing the dashboard.</Text>
                    </Paper>
                </Stack>
            </Container>
        </>
    );
};

export default Dashboard;
