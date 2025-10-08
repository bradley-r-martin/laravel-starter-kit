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
import { UserCheckIcon } from 'lucide-react';

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

export default function Reopen({ user }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Reopen User Account: ${user.first_name} ${user.last_name}`} />
            <Modal>
                <ModalHeader
                    hero
                    title="Reopen account"
                    description={
                        <>
                            Restore access for:{' '}
                            <strong>
                                {user.first_name} {user.last_name}
                            </strong>
                        </>
                    }
                    icon={<UserCheckIcon className="size-6" />}
                    color="green"
                />

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('users.reopen', user.id), method: 'post' }}
                        onSuccess={() => modal?.close()}
                    >
                        <ModalContent>
                            <Field name="reason">
                                <Textarea
                                    label="Reason for Reopening"
                                    name="reason"
                                    rows={4}
                                    placeholder="Provide a reason for reopening this account..."
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
                            <Button type="submit" loading={processing} color="green">
                                {processing ? 'Reopening...' : 'Reopen Account'}
                            </Button>
                        </Actions>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
