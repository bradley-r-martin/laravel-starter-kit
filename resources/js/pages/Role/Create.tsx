import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
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

export default function Create() {
    const form = useForm({
        name: '',
        description: '',
        hidden: false,
    });
    const { processing } = form;

    return (
        <>
            <Head title="Create Role" />
            <Container size="md" py="xl">
                <Stack gap="xl">
                    <Group justify="space-between" align="center">
                        <Title order={1}>Create Role</Title>
                        <Button component={Link} href={route('roles.index')} variant="default">
                            Back to List
                        </Button>
                    </Group>

                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <FormErrorSound>
                            <Form
                                form={form}
                                action={{ url: route('roles.store'), method: 'post' }}
                            >
                                <Stack gap="md">
                                    <Field name="name">
                                        <TextInput label="Name" name="name" />
                                    </Field>

                                    <Field name="description">
                                        <Textarea label="Description" name="description" rows={4} />
                                    </Field>

                                    <Field name="hidden" type="checkbox">
                                        <Checkbox label="Hidden" name="hidden" />
                                    </Field>
                                    <Group justify="flex-end" mt="md">
                                        <Anchor
                                            component={Link}
                                            href={route('roles.index')}
                                            type="button"
                                            c="dimmed"
                                        >
                                            Cancel
                                        </Anchor>
                                        <Button type="submit" loading={processing}>
                                            {processing ? 'Creating...' : 'Create Role'}
                                        </Button>
                                    </Group>
                                </Stack>
                            </Form>
                        </FormErrorSound>
                    </Paper>
                </Stack>
            </Container>
        </>
    );
}
