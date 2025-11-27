import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Stack, TextInput } from '@mantine/core';
import { PencilIcon } from 'lucide-react';

interface UpdateProps {
    wholesaler: Models.Wholesaler;
}

export default function Update({ wholesaler }: UpdateProps) {
    const modal = useModal();
    const form = useForm({
        name: wholesaler.name,
    });
    const { processing } = form;

    return (
        <>
            <Head title={`Update Wholesaler: ${wholesaler.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Update wholesaler"
                        description={
                            <>
                                You are updating: <strong>{wholesaler.name}</strong>
                            </>
                        }
                        icon={<PencilIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('wholesalers.update', wholesaler.id),
                                method: 'post',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack>
                                    <Field name="name">
                                        <TextInput
                                            label="Name"
                                            name="name"
                                            placeholder="Enter wholesaler name"
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
                                <Button type="submit" loading={processing}>
                                    {processing ? 'Updating...' : 'Update Wholesaler'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
