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

interface ProductType {
    id: string;
    name: string;
}

interface Props {
    product_type: ProductType;
}

export default function Destroy({ product_type }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Destroy Product Type: ${product_type.name}`} />
            <Modal>
                <Modal.Body>
                <ModalHeader
                    hero
                    title={`Destroy product type`}
                    description={
                        <>
                            You are about to permanently destroy:{' '}
                            <strong>{product_type.name}</strong>
                        </>
                    }
                    icon={<TrashIcon className="size-6" />}
                    color="red"
                />

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{
                            url: route('product-types.destroy', product_type.id),
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
                                product type record.
                            </Alert>
                            <Field name="reason">
                                <Textarea
                                    label="Reason for Destroying"
                                    name="reason"
                                    rows={4}
                                    placeholder="Provide a reason for destroying this product type..."
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
