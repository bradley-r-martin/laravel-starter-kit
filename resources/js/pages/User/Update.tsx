import { Actions } from '@/components/Actions';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { ModalContent } from '@/components/ModalContent';
import ModalHeader from '@/components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Stack, TextInput } from '@mantine/core';
import { UserCogIcon } from 'lucide-react';

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
                <ModalHeader
                    hero
                    title="Update user"
                    description={
                        <>
                            Edit details for:{' '}
                            <strong>
                                {user.first_name} {user.last_name}
                            </strong>
                        </>
                    }
                    icon={<UserCogIcon className="size-6" />}
                    color="blue"
                />

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('users.update', user.id), method: 'put' }}
                        onSuccess={() => modal?.close()}
                    >
                        <ModalContent>
                            <Stack>
                            <Field name="first_name">
                                <TextInput label="First Name" name="first_name" />
                            </Field>

                            <Field name="last_name">
                                <TextInput label="Last Name" name="last_name" />
                            </Field>

                            <Field name="email">
                                <TextInput label="Email" name="email" type="email" />
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
                                    {processing ? 'Updating...' : 'Update User'}
                                </Button>
                        </Actions>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
