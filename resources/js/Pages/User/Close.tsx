import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Textarea } from '@mantine/core';
import { UserIcon } from 'lucide-react';

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
                <Modal.Body>
                    <ModalHeader
                        hero
                        title={`Close account`}
                        description={
                            <>
                                You are about to close the account for:{' '}
                                <strong>
                                    {user.first_name} {user.last_name}
                                </strong>
                            </>
                        }
                        icon={<UserIcon className="size-6" />}
                        color="red"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('users.close', user.id), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Field name="reason">
                                    <Textarea
                                        label="Reason for Closing"
                                        name="reason"
                                        rows={4}
                                        placeholder="Provide a reason for closing this account..."
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
                                    Close account
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
