import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Head, useForm } from '@inertiajs/react';
import { Modal, useModal } from '@inertiaui/modal-react';
import { Anchor, Button, Group, Stack, TextInput, Title } from '@mantine/core';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface UpdateProps {
    user: User;
}

export default function Update({ user }: UpdateProps) {
    const modal = useModal();
    const form = useForm({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
    });
    const { processing } = form;

    return (
        <>
            <Head title="Update User" />
            <Modal>
                <Title order={2} mb="lg">
                    Update User
                </Title>

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('users.update', user.id), method: 'put' }}
                        onSuccess={() => modal?.close()}
                    >
                        <Stack gap="md">
                            <Field name="first_name">
                                <TextInput label="First Name" name="first_name" />
                            </Field>

                            <Field name="last_name">
                                <TextInput label="Last Name" name="last_name" />
                            </Field>

                            <Field name="email">
                                <TextInput label="Email" name="email" type="email" />
                            </Field>

                            <Group justify="flex-end" mt="md">
                                <Anchor onClick={() => modal?.close()} type="button" c="dimmed">
                                    Cancel
                                </Anchor>
                                <Button type="submit" loading={processing}>
                                    {processing ? 'Updating...' : 'Update User'}
                                </Button>
                            </Group>
                        </Stack>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
