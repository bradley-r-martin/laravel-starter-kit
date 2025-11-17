import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { PackagePlusIcon } from 'lucide-react';

interface Territory {
    id: string;
    name: string;
}

interface Operator {
    id: string;
    name: string;
}

interface CreateProps {
    territories: Territory[];
    operators: Operator[];
}

export default function Create({ territories, operators }: CreateProps) {
    const modal = useModal();
    const form = useForm({
        territory_id: '',
        operator_id: '',
        name: '',
        type: 'box',
        icon: null as string | null,
        price: 0,
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

                                    <Field name="territory_id" type="select">
                                        <Select
                                            label="Territory"
                                            name="territory_id"
                                            placeholder="Select territory"
                                            data={territories.map((territory) => ({
                                                value: territory.id,
                                                label: territory.name,
                                            }))}
                                            searchable
                                        />
                                    </Field>

                                    <Field name="operator_id" type="select">
                                        <Select
                                            label="Operator"
                                            name="operator_id"
                                            placeholder="Select operator"
                                            data={operators.map((operator) => ({
                                                value: operator.id,
                                                label: operator.name,
                                            }))}
                                            searchable
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
