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
import { PlusIcon } from 'lucide-react';

export default function Create() {
    const modal = useModal();
    const form = useForm({
        name: '',
    });
    const { processing } = form;

    return (
        <>
            <Head title="Create Product Type" />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Create product type"
                        description="Add a new product type to the system"
                        icon={<PlusIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('product-types.store'), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack>
                                    <Field name="name">
                                        <TextInput
                                            label="Name"
                                            name="name"
                                            placeholder="Enter product type name"
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
                                    {processing ? 'Creating...' : 'Create Product Type'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
