import { Actions } from '@/components/Actions';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, PasswordInput, Select, Stack, TextInput, Title } from '@mantine/core';

interface SelectOption {
    value: string;
    label: string;
}

interface CreateProps {
    roles: SelectOption[];
    operators: SelectOption[];
}

export default function Create({ roles, operators }: CreateProps) {
    const modal = useModal();
    const form = useForm({
        operator_id: '',
        role_id: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });
    const { processing } = form;

    return (
        <>
            <Head title="Create User" />
            <Modal>
                <Title order={2} mb="lg">
                    Create User
                </Title>

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('users.store'), method: 'post' }}
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

                            <Field name="password">
                                <PasswordInput label="Password" name="password" />
                            </Field>

                            <Actions>
                                <Button
                                    onClick={() => modal?.close()}
                                    type="button"
                                    variant="subtle"
                                    color="zinc"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" loading={processing}>
                                    {processing ? 'Creating...' : 'Create User'}
                                </Button>
                            </Actions>
                        </Stack>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
