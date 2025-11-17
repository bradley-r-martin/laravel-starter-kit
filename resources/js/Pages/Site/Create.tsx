import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import AddressInput from '@/Components/Inputs/AddressInput';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { BuildingIcon } from 'lucide-react';

interface Territory {
    id: string;
    name: string;
}

interface Operator {
    id: string;
    name: string;
}

interface Route {
    id: string;
    name: string;
}

interface CreateProps {
    territories: Territory[];
    operators: Operator[];
    routes: Route[];
}

export default function Create({ territories, operators, routes }: CreateProps) {
    const modal = useModal();
    const form = useForm({
        territory_id: '',
        operator_id: '',
        route_id: null as string | null,
        order: 0,
        name: '',
        address: null,
        opening_hours: null as any[] | null,
        manager_code: null as string | null,
    });
    const { processing } = form;

    return (
        <>
            <Head title="Create Site" />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Create site"
                        description="Add a new site to the system"
                        icon={<BuildingIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('sites.store'), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack gap="md">
                                    <Field name="name">
                                        <TextInput
                                            label="Name"
                                            name="name"
                                            placeholder="Enter site name"
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

                                    <Field name="route_id" type="select">
                                        <Select
                                            label="Route"
                                            name="route_id"
                                            placeholder="Select route (optional)"
                                            data={routes.map((route) => ({
                                                value: route.id,
                                                label: route.name,
                                            }))}
                                            searchable
                                            clearable
                                        />
                                    </Field>

                                    <Field name="order">
                                        <NumberInput
                                            label="Order"
                                            name="order"
                                            placeholder="Enter order"
                                            min={0}
                                        />
                                    </Field>

                                    <Field name="address" type="address">
                                        <AddressInput
                                            label="Address"
                                            name="address"
                                            allowManualEntry
                                            allowManualEntryChange
                                        />
                                    </Field>

                                    <Field name="manager_code">
                                        <TextInput
                                            label="Manager Code"
                                            name="manager_code"
                                            placeholder="Enter manager code (optional)"
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
                                    Create Site
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}

