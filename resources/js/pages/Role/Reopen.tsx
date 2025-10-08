import { Actions } from '@/components/Actions';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { ModalContent } from '@/components/ModalContent';
import ModalHeader from '@/components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Textarea } from '@mantine/core';
import { ShieldCheckIcon } from 'lucide-react';

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
                <ModalHeader
                    hero
                    title="Reopen role"
                    description={
                        <>
                            Restore role: <strong>{role.name}</strong>
                        </>
                    }
                    icon={<ShieldCheckIcon className="size-6" />}
                    color="green"
                />

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('roles.reopen', role.id), method: 'post' }}
                        onSuccess={() => modal?.close()}
                    >
                        <ModalContent>
                            <Field name="reason">
                                <Textarea
                                    label="Reason for Reopening"
                                    name="reason"
                                    rows={4}
                                    placeholder="Provide a reason for reopening this role..."
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
                                <Button type="submit" loading={processing} color="green">
                                    {processing ? 'Reopening...' : 'Reopen Role'}
                                </Button>
                        </Actions>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
