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
import { TrashIcon } from 'lucide-react';

interface DestroyProps {
    expense: Models.Expense;
}

export default function Destroy({ expense }: DestroyProps) {
    const modal = useModal();
    const form = useForm({
        reason: '',
    });
    const { processing } = form;

    return (
        <>
            <Head title={`Destroy Expense: ${expense.invoice_no}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Destroy expense"
                        description={
                            <>
                                You are permanently destroying:{' '}
                                <strong>{expense.invoice_no}</strong>
                            </>
                        }
                        icon={<TrashIcon className="size-6" />}
                        color="red"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('expenses.destroy', expense.id),
                                method: 'delete',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack>
                                    <Field name="reason">
                                        <Textarea
                                            label="Reason"
                                            name="reason"
                                            placeholder="Enter reason for destroying this expense"
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
                                <Button type="submit" loading={processing} color="red">
                                    {processing ? 'Destroying...' : 'Destroy Expense'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
