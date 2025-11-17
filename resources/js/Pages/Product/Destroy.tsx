import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Stack, Textarea } from '@mantine/core';
import { TrashIcon } from 'lucide-react';

interface Product {
    id: string;
    name: string;
}

interface DestroyProps {
    product: Product;
}

export default function Destroy({ product }: DestroyProps) {
    const modal = useModal();
    const form = useForm({
        reason: '',
    });
    const { processing } = form;

    return (
        <>
            <Head title={`Destroy Product: ${product.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Destroy product"
                        description={
                            <>
                                You are permanently destroying: <strong>{product.name}</strong>
                            </>
                        }
                        icon={<TrashIcon className="size-6" />}
                        color="red"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('products.destroy', product.id),
                                method: 'delete',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack>
                                    <Field name="reason">
                                        <Textarea
                                            label="Reason"
                                            name="reason"
                                            placeholder="Enter reason for destroying this product"
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
                                    {processing ? 'Destroying...' : 'Destroy Product'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
