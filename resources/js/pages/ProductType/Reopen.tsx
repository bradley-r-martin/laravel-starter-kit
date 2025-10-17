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
import { RotateCcwIcon } from 'lucide-react';

interface ProductType {
    id: string;
    name: string;
}

interface Props {
    product_type: ProductType;
}

export default function Reopen({ product_type }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Reopen Product Type: ${product_type.name}`} />
            <Modal>
                <ModalHeader
                    hero
                    title={`Reopen product type`}
                    description={
                        <>
                            You are about to reopen the product type:{' '}
                            <strong>{product_type.name}</strong>
                        </>
                    }
                    icon={<RotateCcwIcon className="size-6" />}
                    color="green"
                />

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{
                            url: route('product-types.reopen', product_type.id),
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
                                    placeholder="Provide a reason for reopening this product type..."
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
                                Reopen product type
                            </Button>
                        </Actions>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
