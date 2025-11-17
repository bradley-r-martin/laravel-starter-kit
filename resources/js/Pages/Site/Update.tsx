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
import { Alert, Button, Stack, TextInput } from '@mantine/core';
import { AlertCircleIcon, BuildingIcon } from 'lucide-react';

interface Site {
    id: string;
    name: string;
    address: Domain.Address | null;
    opening_hours: any[] | null;
    manager_code: string | null;
    closed_at: string | null;
}

interface Props {
    site: Site;
}

export default function Update({ site }: Props) {
    const modal = useModal();
    const isClosed = !!site.closed_at;

    const form = useForm({
        name: site.name || '',
        address: site.address || null,
        opening_hours: site.opening_hours || null,
        manager_code: site.manager_code || null,
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Update Site: ${site.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Update site"
                        description={
                            <>
                                Edit details for site: <strong>{site.name}</strong>
                            </>
                        }
                        icon={<BuildingIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('sites.update', site.id),
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
                                        title="Cannot Update Site"
                                        mb="md"
                                    >
                                        This site is closed and cannot be updated.
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

                                    <Field name="address" type="address">
                                        <AddressInput
                                            label="Address"
                                            name="address"
                                            allowManualEntry
                                            allowManualEntryChange
                                            disabled={isClosed}
                                        />
                                    </Field>

                                    <Field name="manager_code">
                                        <TextInput
                                            label="Manager Code"
                                            name="manager_code"
                                            placeholder="Enter manager code (optional)"
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
                                    {processing ? 'Updating...' : 'Update Site'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
