import { Actions } from '@/components/Actions';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Stack, Text, Textarea, Title } from '@mantine/core';

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

export default function Reopen({ user }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Reopen User Account: ${user.first_name} ${user.last_name}`} />
            <Modal>
                <Title order={2} mb="lg">
                    Reopen User Account
                </Title>

                <Text size="sm" c="dimmed" mb="md">
                    You are about to reopen the account for:{' '}
                    <strong>
                        {user.first_name} {user.last_name}
                    </strong>{' '}
                    ({user.email})
                </Text>

                <Text size="sm" c="dimmed" mb="md">
                    This will restore access to the user account and allow them to log in again. The
                    account will return to its active state.
                </Text>

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('users.reopen', user.id), method: 'post' }}
                        onSuccess={() => modal?.close()}
                    >
                        <Stack gap="md">
                            <Field name="reason">
                                <Textarea
                                    label="Reason for Reopening"
                                    name="reason"
                                    rows={4}
                                    placeholder="Provide a reason for reopening this account..."
                                />
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
                                <Button type="submit" loading={processing} color="green">
                                    {processing ? 'Reopening...' : 'Reopen Account'}
                                </Button>
                            </Actions>
                        </Stack>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
