import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Anchor, Button, Group, Stack, Text, Textarea, Title } from '@mantine/core';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    closed_at: string | null;
}

interface Props {
    user: User;
}

export default function Destroy({ user }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Destroy User Account: ${user.first_name} ${user.last_name}`} />
            <Modal>
                <Title order={2} mb="lg">
                    Destroy User Account
                </Title>

                <Text size="sm" c="dimmed" mb="md">
                    You are about to permanently destroy the account for:{' '}
                    <strong>
                        {user.first_name} {user.last_name}
                    </strong>{' '}
                    ({user.email})
                </Text>

                <Text size="sm" c="red" mb="md">
                    <strong>WARNING:</strong> This action is irreversible. The user account will be
                    permanently deleted from the system. This should only be done when the user
                    account is no longer needed and all data should be removed.
                </Text>

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('users.destroy', user.id), method: 'delete' }}
                        onSuccess={() => modal?.close()}
                    >
                        <Stack gap="md">
                            <Field name="reason">
                                <Textarea
                                    label="Reason for Destruction"
                                    name="reason"
                                    rows={4}
                                    placeholder="Provide a reason for destroying this account..."
                                />
                            </Field>

                            <Group justify="flex-end" mt="md">
                                <Anchor onClick={() => modal?.close()} type="button" c="dimmed">
                                    Cancel
                                </Anchor>
                                <Button type="submit" loading={processing} color="red">
                                    {processing ? 'Destroying...' : 'Destroy Account'}
                                </Button>
                            </Group>
                        </Stack>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
