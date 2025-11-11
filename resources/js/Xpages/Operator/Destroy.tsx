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
import { TrashIcon } from 'lucide-react';

interface Operator {
    id: string;
    name: string;
}

interface Props {
    operator: Operator;
}

export default function Destroy({ operator }: Props) {
    const modal = useModal();
    const form = useForm({
        reason: '',
    });
    const { processing } = form;

    return (
        <>
            <Head title={`Destroy Operator: ${operator.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Destroy operator"
                        description={
                            <>
                                Permanently remove the operator: <strong>{operator.name}</strong>
                            </>
                        }
                        icon={<TrashIcon className="size-6" />}
                        color="red"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('operators.destroy', operator.id),
                                method: 'delete',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Field name="reason">
                                    <Textarea
                                        label="Reason for Destruction"
                                        name="reason"
                                        rows={4}
                                        placeholder="Provide a reason for destroying this operator..."
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
                                <Button type="submit" loading={processing} color="red">
                                    Destroy operator
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
