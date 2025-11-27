import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Checkbox, Textarea } from '@mantine/core';
import { UserPlusIcon } from 'lucide-react';

interface Props {
    user: Models.User;
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
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Unsuspend user"
                        description={
                            <>
                                Restore access for:{' '}
                                <strong>
                                    {user.first_name} {user.last_name}
                                </strong>
                            </>
                        }
                        icon={<UserPlusIcon className="size-6" />}
                        color="green"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('users.unsuspend', user.id), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
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
                                    {processing ? 'Unsuspending...' : 'Unsuspend User'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
