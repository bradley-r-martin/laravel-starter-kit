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
import { AlertTriangleIcon, TrashIcon } from 'lucide-react';

interface Props {
    manufacturer: Models.Manufacturer;
}

export default function Destroy({ manufacturer }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Destroy Manufacturer: ${manufacturer.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title={`Destroy manufacturer`}
                        description={
                            <>
                                You are about to permanently destroy:{' '}
                                <strong>{manufacturer.name}</strong>
                            </>
                        }
                        icon={<TrashIcon className="size-6" />}
                        color="red"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('manufacturers.destroy', manufacturer.id),
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
                                    manufacturer record.
                                </Alert>
                                <Field name="reason">
                                    <Textarea
                                        label="Reason for Destroying"
                                        name="reason"
                                        rows={4}
                                        placeholder="Provide a reason for destroying this manufacturer..."
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
