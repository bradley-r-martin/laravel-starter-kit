import { Actions } from '@/components/Actions';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { ModalContent } from '@/components/ModalContent';
import ModalHeader from '@/components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button } from '@mantine/core';
import { AlertCircleIcon, AlertTriangleIcon, ShieldOffIcon } from 'lucide-react';

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
                <ModalHeader
                    hero
                    title="Destroy role"
                    description={
                        <>
                            Permanently delete role: <strong>{role.name}</strong>
                        </>
                    }
                    icon={<ShieldOffIcon className="size-6" />}
                    color="red"
                />

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('roles.destroy', role.id), method: 'delete' }}
                        onSuccess={() => modal?.close()}
                    >
                        <ModalContent>
                            {isNotClosed && (
                                <Alert
                                    variant="light"
                                    color="red"
                                    icon={<AlertCircleIcon className="size-5" />}
                                    title="Cannot Destroy Role"
                                    mb="md"
                                >
                                    This role must be closed before it can be destroyed. Please
                                    close the role first.
                                </Alert>
                            )}

                            <Alert
                                variant="light"
                                color="red"
                                icon={<AlertTriangleIcon className="size-5" />}
                                mb="md"
                            >
                                <strong>Warning:</strong> This action is permanent and cannot be
                                undone. The role will be completely removed from the system.
                            </Alert>
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
                                disabled={isNotClosed}
                            >
                                {processing ? 'Destroying...' : 'Destroy Role'}
                            </Button>
                        </Actions>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
