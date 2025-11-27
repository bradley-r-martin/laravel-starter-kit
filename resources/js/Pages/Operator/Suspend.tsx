import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Textarea } from '@mantine/core';
import { BanIcon } from 'lucide-react';

interface Props {
    operator: Models.Operator;
}

export default function Suspend({ operator }: Props) {
    const modal = useModal();
    const form = useForm({
        reason: '',
    });
    const { processing } = form;

    return (
        <>
            <Head title={`Suspend Operator: ${operator.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Suspend operator"
                        description={
                            <>
                                Temporarily suspend: <strong>{operator.name}</strong>
                            </>
                        }
                        icon={<BanIcon className="size-6" />}
                        color="orange"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('operators.suspend', operator.id),
                                method: 'post',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Field name="reason">
                                    <Textarea
                                        label="Reason for Suspension"
                                        name="reason"
                                        rows={4}
                                        placeholder="Provide a reason for suspending this operator..."
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
                                <Button type="submit" loading={processing} color="orange">
                                    {processing ? 'Suspending...' : 'Suspend operator'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
