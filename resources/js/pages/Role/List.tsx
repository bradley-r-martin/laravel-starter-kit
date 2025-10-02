import { Head, Link } from '@inertiajs/react';
import { Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';

export default function List() {
    return (
        <>
            <Head title="Roles" />
            <Container size="xl" py="xl">
                <Stack gap="xl">
                    <Group justify="space-between" align="center">
                        <Title order={1}>Roles</Title>
                        <Link href={route('roles.create')}>
                            <Button>Create Role</Button>
                        </Link>
                    </Group>

                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <Text c="dimmed">Roles list will go here</Text>
                    </Paper>
                </Stack>
            </Container>
        </>
    );
}
