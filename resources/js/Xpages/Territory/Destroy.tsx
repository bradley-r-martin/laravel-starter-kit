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

interface Territory {
    id: string;
    name: string;
}

interface Props {
    territory: Territory;
}

export default function Destroy({ territory }: Props) {
    const modal = useModal();

    const form = useForm({
        reason: '',
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Destroy Territory: ${territory.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Destroy territory"
                        description={
                            <>
                                You are about to permanently delete the territory:{' '}
                                <strong>{territory.name}</strong>
                            </>
                        }
                        icon={<TrashIcon className="size-6" />}
                        color="red"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('territories.destroy', territory.id),
                                method: 'delete',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Field name="reason">
                                    <Textarea
                                        label="Reason for Destroying"
                                        name="reason"
                                        rows={4}
                                        placeholder="Provide a reason for destroying this territory..."
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
                                    Destroy territory
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
