import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Head, useForm } from '@inertiajs/react';
import { Modal, useModal } from '@inertiaui/modal-react';
import { Anchor, Button, Checkbox, Group, Stack, Textarea, TextInput, Title } from '@mantine/core';

export default function Create() {
    const modal = useModal();
    const form = useForm({
        name: '',
        description: '',
        hidden: false,
    });
    const { processing } = form;

    return (
        <>
            <Head title="Create Role" />
            <Modal>
                <Title order={2} mb="lg">
                    Create Role
                </Title>

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('roles.store'), method: 'post' }}
                        onSuccess={() => modal?.close()}
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
                                <Anchor onClick={() => modal?.close()} type="button" c="dimmed">
                                    Cancel
                                </Anchor>
                                <Button type="submit" loading={processing}>
                                    {processing ? 'Creating...' : 'Create Role'}
                                </Button>
                            </Group>
                        </Stack>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
