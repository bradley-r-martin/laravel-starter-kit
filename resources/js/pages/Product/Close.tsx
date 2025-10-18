import { Actions } from '@/components/Actions';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { ModalContent } from '@/components/ModalContent';
import ModalHeader from '@/components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Stack, Textarea } from '@mantine/core';
import { XIcon } from 'lucide-react';

interface Product {
    id: string;
    name: string;
}

interface CloseProps {
    product: Product;
}

export default function Close({ product }: CloseProps) {
    const modal = useModal();
    const form = useForm({
        reason: '',
    });
    const { processing } = form;

    return (
        <>
            <Head title={`Close Product: ${product.name}`} />
            <Modal>
            <Modal.Body>
                <ModalHeader
                    hero
                    title="Close product"
                    description={
                        <>
                            You are closing: <strong>{product.name}</strong>
                        </>
                    }
                    icon={<XIcon className="size-6" />}
                    color="red"
                />

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{
                            url: route('products.close', product.id),
                            method: 'post',
                        }}
                        onSuccess={() => modal?.close()}
                    >
                        <ModalContent>
                            <Stack>
                                <Field name="reason">
                                    <Textarea
                                        label="Reason"
                                        name="reason"
                                        placeholder="Enter reason for closing this product"
                                        required
                                        rows={4}
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
                            <Button type="submit" loading={processing} color="red">
                                {processing ? 'Closing...' : 'Close Product'}
                            </Button>
                        </Actions>
                    </Form>
                </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
