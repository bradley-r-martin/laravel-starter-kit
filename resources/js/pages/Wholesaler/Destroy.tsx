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
import { AlertTriangleIcon, TrashIcon } from 'lucide-react';

interface Wholesaler {
    id: string;
    name: string;
}

interface Props {
    wholesaler: Wholesaler;
}

export default function Destroy({ wholesaler }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Destroy Wholesaler: ${wholesaler.name}`} />
            <Modal>
                <Modal.Body>
                <ModalHeader
                    hero
                    title={`Destroy wholesaler`}
                    description={
                        <>
                            You are about to permanently destroy: <strong>{wholesaler.name}</strong>
                        </>
                    }
                    icon={<TrashIcon className="size-6" />}
                    color="red"
                />

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{
                            url: route('wholesalers.destroy', wholesaler.id),
                            method: 'delete',
                        }}
                        onSuccess={() => modal?.close()}
                    >
                        <ModalContent>
                            <Alert
                                color="red"
                                icon={<AlertTriangleIcon className="size-4" />}
                                mb="md"
                            >
                                This action cannot be undone. This will permanently delete the
                                wholesaler record.
                            </Alert>
                            <Field name="reason">
                                <Textarea
                                    label="Reason for Destroying"
                                    name="reason"
                                    rows={4}
                                    placeholder="Provide a reason for destroying this wholesaler..."
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
                                Permanently destroy
                            </Button>
                        </Actions>
                    </Form>
                </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
