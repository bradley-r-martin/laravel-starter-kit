import BaseLayout from '@/Layouts/BaseLayout';
import { InertiaView } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button, Container, Paper, Stack, Text, Title } from '@mantine/core';

interface TerritoryOption {
    id: string;
    name: string;
}

interface TerritoryProps {
    territories: TerritoryOption[];
}

const Territory: InertiaView<TerritoryProps> = ({ territories }) => {
    return (
        <>
            <Head title="Select Territory" />
            <Container size="xs" py="xl" h="100vh">
                <Stack gap="xl">
                    <Stack gap="xs">
                        <Title order={1}>Select Territory</Title>
                        <Text size="sm" c="dimmed">
                            Choose which territory you want to access
                        </Text>
                    </Stack>

                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <Stack gap="md">
                            <Stack gap="xs" mt="xs">
                                {territories.map((territory) => (
                                    <Button
                                        key={territory.id}
                                        data-testid={territory.name}
                                        component={Link}
                                        href={route('territory.process')}
                                        data={{ territory_id: territory.id }}
                                        method="post"
                                    >
                                        {territory.name}
                                    </Button>
                                ))}
                            </Stack>

                            <Button component={Link} href={route('dashboard')}>
                                Logout
                            </Button>
                        </Stack>
                    </Paper>
                </Stack>
            </Container>
        </>
    );
};

Territory.layout = [BaseLayout];

export default Territory;
