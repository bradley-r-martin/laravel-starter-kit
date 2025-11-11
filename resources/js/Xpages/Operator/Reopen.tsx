import { Actions } from '@/components/Actions';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { ModalContent } from '@/components/ModalContent';
import ModalHeader from '@/components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Textarea } from '@mantine/core';
import { RotateCcwIcon } from 'lucide-react';

interface Operator {
    id: string;
    name: string;
}

interface Props {
    operator: Operator;
}

export default function Reopen({ operator }: Props) {
    const modal = useModal();
    const form = useForm({
        reason: '',
    });
    const { processing } = form;

    return (
        <>
            <Head title={`Reopen Operator: ${operator.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Reopen operator"
                        description={
                            <>
                                You are about to reopen the operator:{' '}
                                <strong>{operator.name}</strong>
                            </>
                        }
                        icon={<RotateCcwIcon className="size-6" />}
                        color="green"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('operators.reopen', operator.id),
                                method: 'post',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Field name="reason">
                                    <Textarea
                                        label="Reason for Reopening"
                                        name="reason"
                                        rows={4}
                                        placeholder="Provide a reason for reopening this operator..."
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
                                <Button type="submit" loading={processing} color="green">
                                    Reopen operator
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
