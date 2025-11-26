import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { AvatarInput } from '@/Components/Inputs/AvatarInput/AvatarInput';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Group, Stack, TextInput } from '@mantine/core';
import { UserCogIcon } from 'lucide-react';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: {
        path: string;
        disk: string;
        mime_type: string;
        size: number;
        filename: string;
    } | null;
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
        avatar: user?.avatar,
    });
    const { processing } = form;

    return (
        <>
            <Head title="Update User" />
            <Modal>
                <Modal.Body>
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
                            action={{ url: route('users.update', user.id), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack>
                                    <Field name="avatar" type="file">
                                        <AvatarInput label="Avatar" name="avatar" />
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
                </Modal.Body>
            </Modal>
        </>
    );
}
