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
