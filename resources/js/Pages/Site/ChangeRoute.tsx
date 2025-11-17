import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Select, Stack } from '@mantine/core';
import { RouteIcon } from 'lucide-react';

interface Site {
    id: string;
    name: string;
    route_id: string | null;
    __route_name: string | null;
}

interface Route {
    id: string;
    name: string;
}

interface Props {
    site: Site;
    routes: Route[];
}

export default function ChangeRoute({ site, routes }: Props) {
    const modal = useModal();

    const form = useForm({
        route_id: site.route_id as string | null,
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Change Route: ${site.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Change route"
                        description={
                            <>
                                Change route for site: <strong>{site.name}</strong>
                            </>
                        }
                        icon={<RouteIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('sites.change-route', site.id),
                                method: 'post',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack gap="md">
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
                                    {processing ? 'Changing...' : 'Change Route'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
