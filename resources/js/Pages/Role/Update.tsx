import { Actions } from '@/Components/Actions';
import Data from '@/Components/Data/Data';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { TransferInput } from '@/Components/Inputs/TransferInput';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button, Checkbox, Textarea, TextInput } from '@mantine/core';
import { AlertCircleIcon, ShieldIcon } from 'lucide-react';

interface Role {
    id: string;
    name: string;
    description: string | null;
    hidden: boolean;
    closed_at: string | null;
    policies: string[];
}

interface Props {
    role: Role;
}

export default function Update({ role }: Props) {
    const modal = useModal();
    const isClosed = !!role.closed_at;

    const form = useForm({
        name: role.name || '',
        description: role.description || '',
        hidden: role.hidden || false,
        policies: role.policies || ([] as string[]),
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Update Role: ${role.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Update role"
                        description={
                            <>
                                Edit details for role: <strong>{role.name}</strong>
                            </>
                        }
                        icon={<ShieldIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('roles.update', role.id), method: 'put' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                {isClosed && (
                                    <Alert
                                        variant="light"
                                        color="red"
                                        icon={<AlertCircleIcon className="size-5" />}
                                        title="Cannot Update Role"
                                        mb="md"
                                    >
                                        This role is closed and cannot be updated.
                                    </Alert>
                                )}

                                <Field name="name">
                                    <TextInput label="Name" name="name" disabled={isClosed} />
                                </Field>

                                <Field name="description">
                                    <Textarea
                                        label="Description"
                                        name="description"
                                        rows={4}
                                        disabled={isClosed}
                                    />
                                </Field>

                                <Field name="hidden" type="checkbox">
                                    <Checkbox label="Hidden" name="hidden" disabled={isClosed} />
                                </Field>

                                <Field name="policies" type="transfer">
                                    <Data parameter="availablePolicies" property="items">
                                        <TransferInput label="Policies" className="max-h-[300px]" />
                                    </Data>
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
                                <Button type="submit" loading={processing} disabled={isClosed}>
                                    {processing ? 'Updating...' : 'Update Role'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
