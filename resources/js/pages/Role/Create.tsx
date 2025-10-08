import { Actions } from '@/components/Actions';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { ModalContent } from '@/components/ModalContent';
import ModalHeader from '@/components/ModalHeader';
import { TransferInput, TransferItem } from '@/components/TransferInput';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Checkbox, Textarea, TextInput } from '@mantine/core';
import { ShieldPlusIcon } from 'lucide-react';

interface CreateProps {
    availablePolicies: TransferItem[];
}

export default function Create({ availablePolicies }: CreateProps) {
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

                            <Field name="policies">
                                <TransferInput
                                    label="Policies"
                                    items={availablePolicies}
                                    className="max-h-[300px]"
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
                                <Button type="submit" loading={processing}>
                                    {processing ? 'Creating...' : 'Create Role'}
                                </Button>
                        </Actions>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
