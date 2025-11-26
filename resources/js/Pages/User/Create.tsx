import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Group, PasswordInput, Select, Stack, TextInput } from '@mantine/core';
import { UserPlusIcon } from 'lucide-react';

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
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Create user"
                        description="Add a new user to the system"
                        icon={<UserPlusIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('users.store'), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack>
                                    <Field name="operator_id" type="select">
                                        <Select
                                            label="Operator"
                                            name="operator_id"
                                            placeholder="Select an operator"
                                            data={operators}
                                            searchable
                                        />
                                    </Field>

                                    <Field name="role_id" type="select">
                                        <Select
                                            label="Role"
                                            name="role_id"
                                            placeholder="Select a role"
                                            data={roles}
                                            searchable
                                            clearable
                                        />
                                    </Field>

                                    <Group grow>
                                        <Field name="first_name">
                                            <TextInput label="First Name" name="first_name" />
                                        </Field>

                                        <Field name="last_name">
                                            <TextInput label="Last Name" name="last_name" />
                                        </Field>
                                    </Group>

                                    <Field name="email">
                                        <TextInput label="Email" name="email" type="email" />
                                    </Field>

                                    <Field name="password">
                                        <PasswordInput label="Password" name="password" />
                                    </Field>
                                </Stack>
                            </ModalContent>

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
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
