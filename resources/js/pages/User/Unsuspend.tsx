import { Actions } from '@/components/Actions';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Checkbox, Stack, Text, Textarea, Title } from '@mantine/core';

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

export default function Unsuspend({ user }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
        notify: false,
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Unsuspend User: ${user.first_name} ${user.last_name}`} />
            <Modal>
                <Title order={2} mb="lg">
                    Unsuspend User
                </Title>

                <Text size="sm" c="dimmed" mb="md">
                    You are about to unsuspend the user:{' '}
                    <strong>
                        {user.first_name} {user.last_name}
                    </strong>{' '}
                    ({user.email})
                </Text>

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('users.unsuspend', user.id), method: 'post' }}
                        onSuccess={() => modal?.close()}
                    >
                        <Stack gap="md">
                            <Field name="reason">
                                <Textarea
                                    label="Reason for Unsuspension"
                                    name="reason"
                                    rows={4}
                                    placeholder="Provide a reason for unsuspending this user..."
                                />
                            </Field>

                            <Field name="notify" type="checkbox">
                                <Checkbox
                                    label="Notify user via email about the unsuspension"
                                    name="notify"
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
                                    {processing ? 'Unsuspending...' : 'Unsuspend User'}
                                </Button>
                            </Actions>
                        </Stack>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
