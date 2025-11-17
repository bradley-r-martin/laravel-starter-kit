import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Select, Stack, TextInput } from '@mantine/core';
import { RouteIcon } from 'lucide-react';

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
        schedule: null as string | null,
    });
    const { processing } = form;

    return (
        <>
            <Head title="Create Route" />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Create route"
                        description="Add a new route to the system"
                        icon={<RouteIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('routes.store'), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack gap="md">
                                    <Field name="name">
                                        <TextInput
                                            label="Name"
                                            name="name"
                                            placeholder="Enter route name"
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

                                    <Field name="schedule">
                                        <TextInput
                                            label="Schedule (RRule)"
                                            name="schedule"
                                            placeholder="Enter schedule RRule (optional)"
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
                                    Create Route
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
