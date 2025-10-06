import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Head, useForm } from '@inertiajs/react';
import { Modal, useModal } from '@inertiaui/modal-react';
import { Anchor, Button, Group, Stack, Text, Textarea, Title } from '@mantine/core';

interface Role {
    id: string;
    name: string;
    description: string;
    closed_at: string | null;
}

interface Props {
    role: Role;
}

export default function Reopen({ role }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Reopen Role: ${role.name}`} />
            <Modal>
                <Title order={2} mb="lg">
                    Reopen Role
                </Title>

                <Text size="sm" c="dimmed" mb="md">
                    You are about to reopen the role: <strong>{role.name}</strong>
                </Text>

                <Text size="sm" c="dimmed" mb="md">
                    This will restore the role to its active state and allow it to be assigned to
                    users again. The role will be available for use in the system.
                </Text>

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('roles.reopen', role.id), method: 'post' }}
                        onSuccess={() => modal?.close()}
                    >
                        <Stack gap="md">
                            <Field name="reason">
                                <Textarea
                                    label="Reason for Reopening"
                                    name="reason"
                                    rows={4}
                                    placeholder="Provide a reason for reopening this role..."
                                />
                            </Field>

                            <Group justify="flex-end" mt="md">
                                <Anchor onClick={() => modal?.close()} type="button" c="dimmed">
                                    Cancel
                                </Anchor>
                                <Button type="submit" loading={processing} color="green">
                                    {processing ? 'Reopening...' : 'Reopen Role'}
                                </Button>
                            </Group>
                        </Stack>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
