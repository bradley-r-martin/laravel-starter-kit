import { Actions } from '@/components/Actions';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { ModalContent } from '@/components/ModalContent';
import ModalHeader from '@/components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, PasswordInput, Stack } from '@mantine/core';
import { KeyRoundIcon } from 'lucide-react';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface Props {
    user: User;
    is_current_user: boolean;
}

export default function Password({ user, is_current_user }: Props) {
    const modal = useModal();

    const form = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Change Password: ${user.first_name} ${user.last_name}`} />
            <Modal>
                <ModalHeader
                    hero
                    title="Change password"
                    description={
                        <>
                            Update password for:{' '}
                            <strong>
                                {user.first_name} {user.last_name}
                            </strong>
                        </>
                    }
                    icon={<KeyRoundIcon className="size-6" />}
                    color="blue"
                />

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('users.password', user.id), method: 'put' }}
                        onSuccess={() => modal?.close()}
                    >
                        <ModalContent>
                            <Stack>
                            {is_current_user && (
                                <Field name="current_password">
                                    <PasswordInput
                                        label="Current Password"
                                        name="current_password"
                                        placeholder="Enter your current password"
                                    />
                                </Field>
                            )}

                            <Field name="password">
                                <PasswordInput
                                    label="New Password"
                                    name="password"
                                    placeholder="Enter new password"
                                />
                            </Field>

                            <Field name="password_confirmation">
                                <PasswordInput
                                    label="Confirm New Password"
                                    name="password_confirmation"
                                    placeholder="Confirm new password"
                                />
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
                                    {processing ? 'Changing...' : 'Change Password'}
                                </Button>
                        </Actions>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
