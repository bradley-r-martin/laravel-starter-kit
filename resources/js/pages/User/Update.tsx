import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Head, useForm } from '@inertiajs/react';
import { Modal, useModal } from '@inertiaui/modal-react';
import { Anchor, Button, Group, Select, Stack, TextInput, Title } from '@mantine/core';

interface SelectOption {
    value: string;
    label: string;
}

interface User {
    id: string;
    operator_id: string;
    role_id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface UpdateProps {
    user: User;
    roles: SelectOption[];
    operators: SelectOption[];
}

export default function Update({ user, roles, operators }: UpdateProps) {
    const modal = useModal();
    const form = useForm({
        operator_id: user.operator_id,
        role_id: user.role_id,
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
                            <Field name="operator_id">
                                <Select
                                    label="Operator"
                                    name="operator_id"
                                    placeholder="Select an operator"
                                    data={operators}
                                    searchable
                                />
                            </Field>

                            <Field name="role_id">
                                <Select
                                    label="Role"
                                    name="role_id"
                                    placeholder="Select a role"
                                    data={roles}
                                    searchable
                                    clearable
                                />
                            </Field>

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
