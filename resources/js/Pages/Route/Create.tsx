import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Stack, TextInput } from '@mantine/core';
import { RouteIcon } from 'lucide-react';

interface CreateProps {}

export default function Create({}: CreateProps) {
    const modal = useModal();
    const form = useForm({
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
