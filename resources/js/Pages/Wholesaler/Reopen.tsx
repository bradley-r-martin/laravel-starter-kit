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
import { RotateCcwIcon } from 'lucide-react';

interface Wholesaler {
    id: string;
    name: string;
}

interface Props {
    wholesaler: Wholesaler;
}

export default function Reopen({ wholesaler }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Reopen Wholesaler: ${wholesaler.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title={`Reopen wholesaler`}
                        description={
                            <>
                                You are about to reopen the wholesaler:{' '}
                                <strong>{wholesaler.name}</strong>
                            </>
                        }
                        icon={<RotateCcwIcon className="size-6" />}
                        color="green"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('wholesalers.reopen', wholesaler.id),
                                method: 'post',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Field name="reason">
                                    <Textarea
                                        label="Reason for Reopening"
                                        name="reason"
                                        rows={4}
                                        placeholder="Provide a reason for reopening this wholesaler..."
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
                                    Reopen wholesaler
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
