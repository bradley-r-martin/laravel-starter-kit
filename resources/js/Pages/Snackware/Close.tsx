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
import { AlertCircleIcon, PackageXIcon } from 'lucide-react';

interface Snackware {
    id: string;
    name: string;
    placements_count: number;
    closed_at: string | null;
}

interface Props {
    snackware: Snackware;
}

export default function Close({ snackware }: Props) {
    const modal = useModal();
    const hasPlacements = snackware.placements_count > 0;

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Close Snackware: ${snackware.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Close snackware"
                        description={
                            <>
                                Deactivate snackware: <strong>{snackware.name}</strong>
                            </>
                        }
                        icon={<PackageXIcon className="size-6" />}
                        color="red"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('snackwares.close', snackware.id),
                                method: 'post',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                {hasPlacements && (
                                    <Alert
                                        variant="light"
                                        color="red"
                                        icon={<AlertCircleIcon className="size-5" />}
                                        title="Cannot Close Snackware"
                                        mb="md"
                                    >
                                        This snackware has {snackware.placements_count} placement
                                        {snackware.placements_count !== 1 ? 's' : ''} assigned.
                                        Please remove all placements before closing this snackware.
                                    </Alert>
                                )}

                                <Field name="reason">
                                    <Textarea
                                        label="Reason for Closing"
                                        name="reason"
                                        rows={4}
                                        placeholder="Provide a reason for closing this snackware..."
                                    />
                                </Field>
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
                                    disabled={hasPlacements}
                                >
                                    {processing ? 'Closing...' : 'Close Snackware'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}

