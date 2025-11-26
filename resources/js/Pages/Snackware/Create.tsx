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
import { Button, NumberInput, Stack, TextInput } from '@mantine/core';
import { PackagePlusIcon } from 'lucide-react';

interface CreateProps {}

export default function Create({}: CreateProps) {
    const modal = useModal();
    const form = useForm({
        name: '',
        type: 'box',
        icon: null as string | null,
        price: 0,
        products: [] as string[],
    });
    const { processing } = form;

    return (
        <>
            <Head title="Create Snackware" />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Create snackware"
                        description="Add a new snackware to the system"
                        icon={<PackagePlusIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('snackwares.store'), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack gap="md">
                                    <Field name="name">
                                        <TextInput
                                            label="Name"
                                            name="name"
                                            placeholder="Enter snackware name"
                                            autoFocus
                                        />
                                    </Field>

                                    <Field name="type">
                                        <TextInput
                                            label="Type"
                                            name="type"
                                            placeholder="Enter type (e.g., box)"
                                        />
                                    </Field>

                                    <Field name="icon">
                                        <TextInput
                                            label="Icon"
                                            name="icon"
                                            placeholder="Enter icon name (optional)"
                                        />
                                    </Field>

                                    <Field name="price">
                                        <NumberInput
                                            label="Price (cents)"
                                            name="price"
                                            placeholder="Enter price in cents"
                                            min={0}
                                        />
                                    </Field>

                                    <Field name="products" type="transfer">
                                        <Data parameter="availableProducts" property="items">
                                            <TransferInput
                                                label="Products"
                                                className="max-h-[300px]"
                                                renderItem={(item) => (
                                                    <span className="flex flex-col items-start space-x-2">
                                                        <span>{item.label}</span>
                                                        <span className="text-xs text-zinc-500">
                                                            {item.group}
                                                        </span>
                                                    </span>
                                                )}
                                            />
                                        </Data>
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
                                <Button type="submit" loading={processing}>
                                    Create Snackware
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
