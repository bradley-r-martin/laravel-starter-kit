import { Actions } from '@/Components/Actions';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button, Stack } from '@mantine/core';
import { CheckCircleIcon } from 'lucide-react';

interface CompleteProps {
    expense: Models.Expense;
}

export default function Complete({ expense }: CompleteProps) {
    const modal = useModal();
    const form = useForm({});
    const { processing } = form;

    return (
        <>
            <Head title={`Mark Expense as Complete: ${expense.invoice_no}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Mark expense as complete"
                        description={
                            <>
                                You are marking this expense as complete:{' '}
                                <strong>{expense.invoice_no}</strong>
                            </>
                        }
                        icon={<CheckCircleIcon className="size-6" />}
                        color="green"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('expenses.complete', expense.id),
                                method: 'post',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack>
                                    <Alert
                                        color="green"
                                        icon={<CheckCircleIcon className="size-4" />}
                                    >
                                        This will mark the expense as complete. Once marked as
                                        complete, the expense cannot be modified.
                                    </Alert>
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
                                <Button type="submit" loading={processing} color="green">
                                    {processing ? 'Marking as complete...' : 'Mark as Complete'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
