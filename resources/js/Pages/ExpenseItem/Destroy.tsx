import { Actions } from '@/Components/Actions';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button, Stack } from '@mantine/core';
import { AlertTriangleIcon, TrashIcon } from 'lucide-react';

interface DestroyProps {
    expenseItem: Models.ExpenseItem;
}

export default function Destroy({ expenseItem }: DestroyProps) {
    const modal = useModal();
    const form = useForm({});
    const { processing } = form;

    return (
        <>
            <Head title="Remove Expense Item" />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Remove expense item"
                        description={<>You are about to remove this item from the expense</>}
                        icon={<TrashIcon className="size-6" />}
                        color="red"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('expense-items.destroy', expenseItem.id),
                                method: 'delete',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack>
                                    <Alert
                                        color="red"
                                        icon={<AlertTriangleIcon className="size-4" />}
                                    >
                                        This action will permanently remove the expense item
                                        {expenseItem.item && (
                                            <>
                                                : <strong>{expenseItem.item}</strong>
                                            </>
                                        )}
                                        . This action cannot be undone.
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
                                <Button type="submit" loading={processing} color="red">
                                    {processing ? 'Removing...' : 'Remove Item'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
