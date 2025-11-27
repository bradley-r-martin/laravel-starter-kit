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
import { PackageCheckIcon } from 'lucide-react';

interface Props {
    snackware: Models.Snackware;
}

export default function Reopen({ snackware }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Reopen Snackware: ${snackware.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Reopen snackware"
                        description={
                            <>
                                Restore snackware: <strong>{snackware.name}</strong>
                            </>
                        }
                        icon={<PackageCheckIcon className="size-6" />}
                        color="green"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('snackwares.reopen', snackware.id),
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
                                        placeholder="Provide a reason for reopening this snackware..."
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
                                <Button type="submit" loading={processing} color="green">
                                    {processing ? 'Reopening...' : 'Reopen Snackware'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
