import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Anchor, Button, Group, Stack, Text, Textarea, Title } from '@mantine/core';
import { AlertCircleIcon } from 'lucide-react';

interface Role {
    id: string;
    name: string;
    description: string | null;
    users_count: number;
    closed_at: string | null;
}

interface Props {
    role: Role;
}

export default function Close({ role }: Props) {
    const modal = useModal();
    const hasUsers = role.users_count > 0;

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Close Role: ${role.name}`} />
            <Modal>
                <Title order={2} mb="lg">
                    Close Role
                </Title>

                {hasUsers && (
                    <Alert
                        variant="light"
                        color="red"
                        icon={<AlertCircleIcon className="size-5" />}
                        title="Cannot Close Role"
                        mb="lg"
                    >
                        This role has {role.users_count} user{role.users_count !== 1 ? 's' : ''}{' '}
                        assigned. Please reassign all users before closing this role.
                    </Alert>
                )}

                <Text size="sm" c="dimmed" mb="md">
                    You are about to close the role: <strong>{role.name}</strong>
                </Text>

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('roles.close', role.id), method: 'post' }}
                        onSuccess={() => modal?.close()}
                    >
                        <Stack gap="md">
                            <Field name="reason">
                                <Textarea
                                    label="Reason for Closing"
                                    name="reason"
                                    rows={4}
                                    placeholder="Provide a reason for closing this role..."
                                />
                            </Field>

                            <Group justify="flex-end" mt="md">
                                <Anchor onClick={() => modal?.close()} type="button" c="dimmed">
                                    Cancel
                                </Anchor>
                                <Button
                                    type="submit"
                                    loading={processing}
                                    color="red"
                                    disabled={hasUsers}
                                >
                                    {processing ? 'Closing...' : 'Close Role'}
                                </Button>
                            </Group>
                        </Stack>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
