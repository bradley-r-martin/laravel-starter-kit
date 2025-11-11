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
import { XIcon } from 'lucide-react';

interface Manufacturer {
    id: string;
    name: string;
}

interface Props {
    manufacturer: Manufacturer;
}

export default function Close({ manufacturer }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Close Manufacturer: ${manufacturer.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title={`Close manufacturer`}
                        description={
                            <>
                                You are about to close the manufacturer:{' '}
                                <strong>{manufacturer.name}</strong>
                            </>
                        }
                        icon={<XIcon className="size-6" />}
                        color="red"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('manufacturers.close', manufacturer.id),
                                method: 'post',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Field name="reason">
                                    <Textarea
                                        label="Reason for Closing"
                                        name="reason"
                                        rows={4}
                                        placeholder="Provide a reason for closing this manufacturer..."
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
                                    Close manufacturer
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
