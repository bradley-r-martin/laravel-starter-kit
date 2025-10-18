import { Actions } from '@/components/Actions';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { ModalContent } from '@/components/ModalContent';
import ModalHeader from '@/components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button, Textarea } from '@mantine/core';
import { AlertTriangleIcon, UserXIcon } from 'lucide-react';

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

export default function Destroy({ user }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Destroy User Account: ${user.first_name} ${user.last_name}`} />
            <Modal>
                <Modal.Body>
                <ModalHeader
                    hero
                    title="Destroy account"
                    description={
                        <>
                            You are about to permanently destroy the account for:{' '}
                            <strong>
                                {user.first_name} {user.last_name}
                            </strong>
                        </>
                    }
                    icon={<UserXIcon className="size-6" />}
                    color="red"
                />

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('users.destroy', user.id), method: 'delete' }}
                        onSuccess={() => modal?.close()}
                    >
                        <ModalContent>
                            <Alert
                                variant="light"
                                color="red"
                                icon={<AlertTriangleIcon className="size-5" />}
                                mb="md"
                            >
                                <strong>WARNING:</strong> This action is irreversible. The user
                                account will be permanently deleted from the system.
                            </Alert>

                            <Field name="reason">
                                <Textarea
                                    label="Reason for Destruction"
                                    name="reason"
                                    rows={4}
                                    placeholder="Provide a reason for destroying this account..."
                                />
                            </Field>
                        </ModalContent>

                        <Actions>
                            <Button
                                onClick={() => modal?.close()}
                                type="button"
                                variant="subtle"
                                color="zinc"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" loading={processing} color="red">
                                {processing ? 'Destroying...' : 'Destroy Account'}
                            </Button>
                        </Actions>
                    </Form>
                </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
