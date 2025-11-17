import BaseLayout from '@/Layouts/BaseLayout';
import EntryLayout from '@/Layouts/EntryLayout';
import { InertiaView } from '@/Types';
import { Head, Link } from '@inertiajs/react';
import { Button, Stack } from '@mantine/core';

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

            <Stack gap="xl" p="xl">
                <div className="select-none">
                    <h1 className="text-2xl font-bold text-zinc-950/70">Select Territory</h1>
                    <p className="text-sm text-zinc-950/70">
                        Choose which territory you want to access
                    </p>
                </div>

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
                                variant="outline"
                                color="zinc"
                            >
                                {territory.name}
                            </Button>
                        ))}
                    </Stack>

                    <Button component={Link} href={route('logout')} variant="subtle" color="red">
                        Logout
                    </Button>
                </Stack>
            </Stack>
        </>
    );
};

Territory.layout = [BaseLayout, EntryLayout];

export default Territory;
