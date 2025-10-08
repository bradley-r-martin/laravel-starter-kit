import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Anchor, Button, Group, PasswordInput, Stack, Text, Title } from '@mantine/core';

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
                <Title order={2} mb="lg">
                    Change Password
                </Title>

                <Text size="sm" c="dimmed" mb="md">
                    Changing password for:{' '}
                    <strong>
                        {user.first_name} {user.last_name}
                    </strong>{' '}
                    ({user.email})
                </Text>

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('users.password', user.id), method: 'put' }}
                        onSuccess={() => modal?.close()}
                    >
                        <Stack gap="md">
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

                            <Group justify="flex-end" mt="md">
                                <Anchor onClick={() => modal?.close()} type="button" c="dimmed">
                                    Cancel
                                </Anchor>
                                <Button type="submit" loading={processing}>
                                    {processing ? 'Changing...' : 'Change Password'}
                                </Button>
                            </Group>
                        </Stack>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
