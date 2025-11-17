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
import { RotateCcwIcon } from 'lucide-react';

interface Product {
    id: string;
    name: string;
}

interface ReinstateProps {
    product: Product;
}

export default function Reinstate({ product }: ReinstateProps) {
    const modal = useModal();
    const form = useForm({
        reason: '',
    });
    const { processing } = form;

    return (
        <>
            <Head title={`Reinstate Product: ${product.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Reinstate product"
                        description={
                            <>
                                You are reinstating: <strong>{product.name}</strong>
                            </>
                        }
                        icon={<RotateCcwIcon className="size-6" />}
                        color="green"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('products.reinstate', product.id),
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
                                            placeholder="Enter reason for reinstating this product"
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
                                <Button type="submit" loading={processing} color="green">
                                    {processing ? 'Reinstating...' : 'Reinstate Product'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
