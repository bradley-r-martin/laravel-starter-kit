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
import { Button, Checkbox, Textarea, TextInput } from '@mantine/core';
import { ShieldPlusIcon } from 'lucide-react';

export default function Create() {
    const modal = useModal();
    const form = useForm({
        name: '',
        description: '',
        hidden: false,
        policies: [] as string[],
    });
    const { processing } = form;

    return (
        <>
            <Head title="Create Role" />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Create role"
                        description="Add a new role to the system"
                        icon={<ShieldPlusIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('roles.store'), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Field name="name">
                                    <TextInput label="Name" name="name" />
                                </Field>

                                <Field name="description">
                                    <Textarea label="Description" name="description" rows={4} />
                                </Field>

                                <Field name="hidden" type="checkbox">
                                    <Checkbox label="Hidden" name="hidden" />
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
                                <Button type="submit" loading={processing}>
                                    Create Role
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
