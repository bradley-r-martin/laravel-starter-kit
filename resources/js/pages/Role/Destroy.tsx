import { Actions } from '@/components/Actions';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button, Stack, Text, Title } from '@mantine/core';
import { AlertCircleIcon } from 'lucide-react';

interface Role {
    id: string;
    name: string;
    description: string | null;
    closed_at: string | null;
}

interface Props {
    role: Role;
}

export default function Destroy({ role }: Props) {
    const modal = useModal();
    const isNotClosed = !role.closed_at;

    const form = useForm({});
    const { processing } = form;

    return (
        <>
            <Head title={`Destroy Role: ${role.name}`} />
            <Modal>
                <Title order={2} mb="lg">
                    Destroy Role
                </Title>

                {isNotClosed && (
                    <Alert
                        variant="light"
                        color="red"
                        icon={<AlertCircleIcon className="size-5" />}
                        title="Cannot Destroy Role"
                        mb="lg"
                    >
                        This role must be closed before it can be destroyed. Please close the role
                        first.
                    </Alert>
                )}

                <Alert
                    variant="light"
                    color="red"
                    icon={<AlertCircleIcon className="size-5" />}
                    mb="lg"
                >
                    <strong>Warning:</strong> This action is permanent and cannot be undone. The
                    role will be completely removed from the system.
                </Alert>

                <Text size="sm" c="dimmed" mb="md">
                    You are about to destroy the role: <strong>{role.name}</strong>
                </Text>

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('roles.destroy', role.id), method: 'delete' }}
                        onSuccess={() => modal?.close()}
                    >
                        <Stack gap="md">
                            <Actions>
                                <Button
                                    onClick={() => modal?.close()}
                                    type="button"
                                    variant="subtle"
                                    color="zinc"
                                    data-testid="cancel-action"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={processing}
                                    color="red"
                                    disabled={isNotClosed}
                                >
                                    {processing ? 'Destroying...' : 'Destroy Role'}
                                </Button>
                            </Actions>
                        </Stack>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
