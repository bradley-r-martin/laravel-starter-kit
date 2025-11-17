import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import AddressInput from '@/Components/Inputs/AddressInput';
import { PhoneInput } from '@/Components/Inputs/PhoneInput';
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
        email: '',
        phone: null,
        address: null,
    });
    const { processing } = form;

    return (
        <>
            <Head title="Create Operator" />
            <Modal size="lg">
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Create operator"
                        description="Add a new operator to the system"
                        icon={<PlusIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('operators.store'), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack gap="md">
                                    <Field name="name">
                                        <TextInput
                                            label="Name"
                                            name="name"
                                            placeholder="Enter operator name"
                                            autoFocus
                                        />
                                    </Field>

                                    <Field name="email">
                                        <TextInput
                                            label="Email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter contact email (optional)"
                                        />
                                    </Field>
                                    <Field name="phone" type="phone">
                                        <PhoneInput label="Phone" name="phone" countryCode="+61" />
                                    </Field>
                                    <Field name="address" type="address">
                                        <AddressInput
                                            label="Address"
                                            name="address"
                                            allowManualEntry
                                            allowManualEntryChange
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
                                    {processing ? 'Creating...' : 'Create Operator'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
