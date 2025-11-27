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
import { PencilIcon } from 'lucide-react';

interface UpdateProps {
    expense: Models.Expense;
    wholesalers: Models.Wholesaler[];
}

export default function Update({ expense, wholesalers }: UpdateProps) {
    const modal = useModal();
    const form = useForm({
        invoice_no: expense.invoice_no,
        invoice_date: expense.invoice_date || null,
        wholesaler_id: expense.wholesaler_id || null,
    });
    const { processing } = form;

    return (
        <>
            <Head title={`Update Expense: ${expense.invoice_no}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Update expense"
                        description={
                            <>
                                You are updating: <strong>{expense.invoice_no}</strong>
                            </>
                        }
                        icon={<PencilIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('expenses.update', expense.id),
                                method: 'patch',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack gap="md">
                                    <Field name="invoice_no">
                                        <TextInput
                                            label="Invoice No"
                                            name="invoice_no"
                                            placeholder="Enter invoice number"
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
                                    {processing ? 'Updating...' : 'Update Expense'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
