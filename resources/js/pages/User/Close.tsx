import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Head, useForm } from '@inertiajs/react';
import { Modal, useModal } from '@inertiaui/modal-react';
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

export default function Close({ user }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Close User Account: ${user.first_name} ${user.last_name}`} />
            <Modal>
                <Title order={2} mb="lg">
                    Close User Account
                </Title>

                <Text size="sm" c="dimmed" mb="md">
                    You are about to close the account for:{' '}
                    <strong>
                        {user.first_name} {user.last_name}
                    </strong>{' '}
                    ({user.email})
                </Text>

                <Text size="sm" c="dimmed" mb="md">
                    This is typically used when a user no longer works for the company. This action
                    will permanently close their account.
                </Text>

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('users.close', user.id), method: 'post' }}
                        onSuccess={() => modal?.close()}
                    >
                        <Stack gap="md">
                            <Field name="reason">
                                <Textarea
                                    label="Reason for Closing"
                                    name="reason"
                                    rows={4}
                                    placeholder="Provide a reason for closing this account..."
                                />
                            </Field>

                            <Group justify="flex-end" mt="md">
                                <Anchor onClick={() => modal?.close()} type="button" c="dimmed">
                                    Cancel
                                </Anchor>
                                <Button type="submit" loading={processing} color="red">
                                    {processing ? 'Closing...' : 'Close Account'}
                                </Button>
                            </Group>
                        </Stack>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
