import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button, NumberInput, Stack, TextInput } from '@mantine/core';
import { AlertCircleIcon, PackageIcon } from 'lucide-react';

interface Snackware {
    id: string;
    name: string;
    type: string;
    icon: string | null;
    price: number;
    closed_at: string | null;
}

interface Props {
    snackware: Snackware;
}

export default function Update({ snackware }: Props) {
    const modal = useModal();
    const isClosed = !!snackware.closed_at;

    const form = useForm({
        name: snackware.name || '',
        type: snackware.type || 'box',
        icon: snackware.icon || null,
        price: snackware.price || 0,
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Update Snackware: ${snackware.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Update snackware"
                        description={
                            <>
                                Edit details for snackware: <strong>{snackware.name}</strong>
                            </>
                        }
                        icon={<PackageIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('snackwares.update', snackware.id),
                                method: 'put',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                {isClosed && (
                                    <Alert
                                        variant="light"
                                        color="red"
                                        icon={<AlertCircleIcon className="size-5" />}
                                        title="Cannot Update Snackware"
                                        mb="md"
                                    >
                                        This snackware is closed and cannot be updated.
                                    </Alert>
                                )}

                                <Stack gap="md">
                                    <Field name="name">
                                        <TextInput label="Name" name="name" disabled={isClosed} />
                                    </Field>

                                    <Field name="type">
                                        <TextInput label="Type" name="type" disabled={isClosed} />
                                    </Field>

                                    <Field name="icon">
                                        <TextInput label="Icon" name="icon" disabled={isClosed} />
                                    </Field>

                                    <Field name="price">
                                        <NumberInput
                                            label="Price (cents)"
                                            name="price"
                                            min={0}
                                            disabled={isClosed}
                                        />
                                    </Field>
                                </Stack>
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
                                <Button type="submit" loading={processing} disabled={isClosed}>
                                    {processing ? 'Updating...' : 'Update Snackware'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
