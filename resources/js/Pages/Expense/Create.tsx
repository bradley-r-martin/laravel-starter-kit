import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Select, Stack, TextInput } from '@mantine/core';
import { PlusIcon } from 'lucide-react';

interface Wholesaler {
    id: string;
    name: string;
}

interface CreateProps {
    wholesalers: Wholesaler[];
}

export default function Create({ wholesalers }: CreateProps) {
    const modal = useModal();
    const form = useForm({
        invoice_no: '',
        invoice_date: null as string | null,
        wholesaler_id: '',
    });
    const { processing } = form;

    return (
        <>
            <Head title="Create Expense" />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Create expense"
                        description="Add a new expense to the system"
                        icon={<PlusIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('expenses.store'), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack>
                                    <Field name="invoice_no">
                                        <TextInput
                                            label="Invoice No"
                                            name="invoice_no"
                                            placeholder="Enter invoice number"
                                            required
                                        />
                                    </Field>

                                    <Field name="invoice_date">
                                        <TextInput
                                            label="Invoice Date"
                                            name="invoice_date"
                                            type="date"
                                            placeholder="Select invoice date"
                                        />
                                    </Field>

                                    <Field name="wholesaler_id" type="select">
                                        <Select
                                            label="Wholesaler"
                                            name="wholesaler_id"
                                            placeholder="Select wholesaler"
                                            data={wholesalers.map((wholesaler) => ({
                                                value: wholesaler.id,
                                                label: wholesaler.name,
                                            }))}
                                            searchable
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
                                    Create
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
