import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button, Stack, TextInput } from '@mantine/core';
import { AlertCircleIcon, RouteIcon } from 'lucide-react';

interface Route {
    id: string;
    name: string;
    schedule: string | null;
    closed_at: string | null;
}

interface Props {
    route: Route;
}

export default function Update({ route }: Props) {
    const modal = useModal();
    const isClosed = !!route.closed_at;

    const form = useForm({
        name: route.name || '',
        schedule: route.schedule || null,
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Update Route: ${route.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Update route"
                        description={
                            <>
                                Edit details for route: <strong>{route.name}</strong>
                            </>
                        }
                        icon={<RouteIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('routes.update', route.id),
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
                                        title="Cannot Update Route"
                                        mb="md"
                                    >
                                        This route is closed and cannot be updated.
                                    </Alert>
                                )}

                                <Stack gap="md">
                                    <Field name="name">
                                        <TextInput
                                            label="Name"
                                            name="name"
                                            disabled={isClosed}
                                            autoFocus
                                        />
                                    </Field>

                                    <Field name="schedule">
                                        <TextInput
                                            label="Schedule (RRule)"
                                            name="schedule"
                                            placeholder="Enter schedule RRule (optional)"
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
                                    {processing ? 'Updating...' : 'Update Route'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
