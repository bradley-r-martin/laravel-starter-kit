import AppLayout from '@/Layouts/AppLayout';
import Header from '@/Parts/Header';
import { addressToEnvelopeString, addressToString } from '@/Utilities/Transformers';
import { InertiaView } from '@/Types';
import { Head } from '@inertiajs/react';
import { Stack, Text } from '@mantine/core';

interface Site {
    id: string;
    name: string;
    address: Domain.Address | null;
}

interface DetailProps {
    site: Site;
}

const Detail: InertiaView<DetailProps> = (props) => {
    const { site } = props;
 
    return (
        <>
            <Head title={site.name} />
            <Header title={site.name} />
            <div className="p-5">
                <Stack gap="md">
                    <div>
                        <Text size="sm" c="dimmed" fw={500} mb="xs">
                            Name
                        </Text>
                        <Text size="md">{site.name}</Text>
                    </div>
                    {site.address && (
                        <div>
                            <Text size="sm" c="dimmed" fw={500} mb="xs">
                                Address
                            </Text>
                            <pre>
                                <Text size="md">{addressToEnvelopeString(site.address)}</Text>
                            </pre>
                        </div>
                    )}
                </Stack>
            </div>
        </>
    );
};

Detail.layout = [AppLayout];

export default Detail;

