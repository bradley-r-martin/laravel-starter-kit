import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import AddressInput from '@/Components/Inputs/AddressInput';
import { PhoneInput, PhoneInputValue } from '@/Components/Inputs/PhoneInput';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Stack, TextInput } from '@mantine/core';
import { PencilIcon } from 'lucide-react';

interface Operator {
    id: string;
    name: string;
    email: string | null;
    phone: PhoneInputValue | null;
    address: Domain.Address | null;
}

interface UpdateProps {
    operator: Operator;
}

export default function Update({ operator }: UpdateProps) {
    const modal = useModal();
    const form = useForm({
        name: operator.name,
        email: operator.email ?? '',
        phone: operator.phone ?? null,
        address: operator.address ?? null,
    });
    const { processing } = form;

    return (
        <>
            <Head title={`Update Operator: ${operator.name}`} />
            <Modal size="lg">
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Update operator"
                        description={
                            <>
                                You are updating: <strong>{operator.name}</strong>
                            </>
                        }
                        icon={<PencilIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('operators.update', operator.id),
                                method: 'post',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack gap="md">
                                    <Field name="name">
                                        <TextInput
                                            label="Name"
                                            name="name"
                                            placeholder="Enter operator name"
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
                                    {processing ? 'Updating...' : 'Update Operator'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
