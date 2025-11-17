import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button, Textarea } from '@mantine/core';
import { AlertCircleIcon, ShieldXIcon } from 'lucide-react';

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
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Close role"
                        description={
                            <>
                                Deactivate role: <strong>{role.name}</strong>
                            </>
                        }
                        icon={<ShieldXIcon className="size-6" />}
                        color="red"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('roles.close', role.id), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                {hasUsers && (
                                    <Alert
                                        variant="light"
                                        color="red"
                                        icon={<AlertCircleIcon className="size-5" />}
                                        title="Cannot Close Role"
                                        mb="md"
                                    >
                                        This role has {role.users_count} user
                                        {role.users_count !== 1 ? 's' : ''} assigned. Please
                                        reassign all users before closing this role.
                                    </Alert>
                                )}

                                <Field name="reason">
                                    <Textarea
                                        label="Reason for Closing"
                                        name="reason"
                                        rows={4}
                                        placeholder="Provide a reason for closing this role..."
                                    />
                                </Field>
                            </ModalContent>

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
                                    disabled={hasUsers}
                                >
                                    {processing ? 'Closing...' : 'Close Role'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
