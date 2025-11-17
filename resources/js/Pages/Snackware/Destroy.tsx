import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button, Textarea } from '@mantine/core';
import { AlertCircleIcon, AlertTriangleIcon, PackageXIcon } from 'lucide-react';

interface Snackware {
    id: string;
    name: string;
    closed_at: string | null;
}

interface Props {
    snackware: Snackware;
}

export default function Destroy({ snackware }: Props) {
    const modal = useModal();
    const isNotClosed = !snackware.closed_at;

    const form = useForm({
        reason: '',
    });
    const { processing } = form;

    return (
        <>
            <Head title={`Destroy Snackware: ${snackware.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Destroy snackware"
                        description={
                            <>
                                Permanently delete snackware: <strong>{snackware.name}</strong>
                            </>
                        }
                        icon={<PackageXIcon className="size-6" />}
                        color="red"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('snackwares.destroy', snackware.id),
                                method: 'delete',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                {isNotClosed && (
                                    <Alert
                                        variant="light"
                                        color="red"
                                        icon={<AlertCircleIcon className="size-5" />}
                                        title="Cannot Destroy Snackware"
                                        mb="md"
                                    >
                                        This snackware must be closed before it can be destroyed.
                                        Please close the snackware first.
                                    </Alert>
                                )}

                                <Field name="reason">
                                    <Textarea
                                        label="Reason for Destruction"
                                        name="reason"
                                        rows={4}
                                        placeholder="Provide a reason for destroying this snackware..."
                                    />
                                </Field>

                                <Alert
                                    variant="light"
                                    color="red"
                                    icon={<AlertTriangleIcon className="size-5" />}
                                    mb="md"
                                    mt="md"
                                >
                                    <strong>Warning:</strong> This action is permanent and cannot be
                                    undone. The snackware will be completely removed from the
                                    system.
                                </Alert>
                            </ModalContent>

                            <Actions>
                                <Button
                                    onClick={() => modal?.close()}
                                    type="button"
                                    variant="subtle"
                                    color="zinc"
                                    data-testid="cancel-action"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={processing}
                                    color="red"
                                    disabled={isNotClosed}
                                >
                                    {processing ? 'Destroying...' : 'Destroy Snackware'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
