import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Checkbox, Stack, Textarea } from '@mantine/core';
import { UserMinusIcon } from 'lucide-react';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    suspended_at: string | null;
}

interface Props {
    user: User;
}

export default function Suspend({ user }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
        notify: false,
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Suspend User: ${user.first_name} ${user.last_name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Suspend user"
                        description={
                            <>
                                Temporarily restrict access for:{' '}
                                <strong>
                                    {user.first_name} {user.last_name}
                                </strong>
                            </>
                        }
                        icon={<UserMinusIcon className="size-6" />}
                        color="orange"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('users.suspend', user.id), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack>
                                    <Field name="reason">
                                        <Textarea
                                            label="Reason for Suspension"
                                            name="reason"
                                            rows={4}
                                            placeholder="Provide a reason for suspending this user..."
                                        />
                                    </Field>

                                    <Field name="notify" type="checkbox">
                                        <Checkbox
                                            label="Notify user via email about the suspension"
                                            name="notify"
                                        />
                                    </Field>
                                </Stack>
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
                                <Button type="submit" loading={processing} color="orange">
                                    {processing ? 'Suspending...' : 'Suspend User'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
