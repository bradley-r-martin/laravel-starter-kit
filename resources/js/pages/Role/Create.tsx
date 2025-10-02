import { Head, Link, useForm } from '@inertiajs/react';
import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    Stack,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core';
import { FormEventHandler } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        hidden: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    return (
        <>
            <Head title="Create Role" />
            <Container size="md" py="xl">
                <Stack gap="xl">
                    <Group justify="space-between" align="center">
                        <Title order={1}>Create Role</Title>
                        <Link href={route('roles.index')}>
                            <Button variant="default">Back to List</Button>
                        </Link>
                    </Group>

                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <form onSubmit={submit}>
                            <Stack gap="md">
                                <TextInput
                                    label="Name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                />

                                <Textarea
                                    label="Description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    error={errors.description}
                                    rows={4}
                                />

                                <Checkbox
                                    label="Hidden"
                                    name="hidden"
                                    checked={data.hidden}
                                    onChange={(e) => setData('hidden', e.target.checked)}
                                />

                                <Group justify="flex-end" mt="md">
                                    <Link href={route('roles.index')}>
                                        <Anchor component="button" type="button" c="dimmed">
                                            Cancel
                                        </Anchor>
                                    </Link>
                                    <Button type="submit" loading={processing}>
                                        {processing ? 'Creating...' : 'Create Role'}
                                    </Button>
                                </Group>
                            </Stack>
                        </form>
                    </Paper>
                </Stack>
            </Container>
        </>
    );
}
