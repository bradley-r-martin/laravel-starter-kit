import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Anchor, Button, Checkbox, Group, Stack, Text, Textarea, Title } from '@mantine/core';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    suspended_at: string | null;
}

interface Props {
    user: User;
}

export default function Suspend({ user }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
        notify: false,
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Suspend User: ${user.first_name} ${user.last_name}`} />
            <Modal>
                <Title order={2} mb="lg">
                    Suspend User
                </Title>

                <Text size="sm" c="dimmed" mb="md">
                    You are about to suspend the user:{' '}
                    <strong>
                        {user.first_name} {user.last_name}
                    </strong>{' '}
                    ({user.email})
                </Text>

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('users.suspend', user.id), method: 'post' }}
                        onSuccess={() => modal?.close()}
                    >
                        <Stack gap="md">
                            <Field name="reason">
                                <Textarea
                                    label="Reason for Suspension"
                                    name="reason"
                                    rows={4}
                                    placeholder="Provide a reason for suspending this user..."
                                />
                            </Field>

                            <Field name="notify" type="checkbox">
                                <Checkbox
                                    label="Notify user via email about the suspension"
                                    name="notify"
                                />
                            </Field>

                            <Group justify="flex-end" mt="md">
                                <Anchor onClick={() => modal?.close()} type="button" c="dimmed">
                                    Cancel
                                </Anchor>
                                <Button type="submit" loading={processing} color="orange">
                                    {processing ? 'Suspending...' : 'Suspend User'}
                                </Button>
                            </Group>
                        </Stack>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
