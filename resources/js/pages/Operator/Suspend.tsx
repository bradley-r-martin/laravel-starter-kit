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
import { BanIcon } from 'lucide-react';

interface Operator {
    id: string;
    name: string;
    suspended_at: string | null;
}

interface Props {
    operator: Operator;
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
