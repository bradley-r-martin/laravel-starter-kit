import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import CurrencyInput from '@/Components/Inputs/CurrencyInput/CurrencyInput';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { AlertCircleIcon, PackageIcon } from 'lucide-react';

interface Props {
    snackware: Models.Snackware;
}

export default function Update({ snackware }: Props) {
    const modal = useModal();
    const isClosed = !!snackware.closed_at;

    const form = useForm({
        name: snackware.name || '',
        type: snackware.type || 'box',
        icon: snackware.icon || null,
        price: snackware.price || 0,
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Update Snackware: ${snackware.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Update snackware"
                        description={
                            <>
                                Edit details for snackware: <strong>{snackware.name}</strong>
                            </>
                        }
                        icon={<PackageIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('snackwares.update', snackware.id),
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
                                        title="Cannot Update Snackware"
                                        mb="md"
                                    >
                                        This snackware is closed and cannot be updated.
                                    </Alert>
                                )}

                                <Stack gap="md">
                                    <Field name="name">
                                        <TextInput label="Name" name="name" disabled={isClosed} />
                                    </Field>

                                    <Group grow>
                                        <Field name="type" type="select">
                                            <Select
                                                label="Type"
                                                name="type"
                                                data={[
                                                    {
                                                        value: 'box',
                                                        label: 'Box',
                                                    },
                                                    {
                                                        value: 'vending-machine',
                                                        label: 'Vending Machine',
                                                    },
                                                ]}
                                            />
                                        </Field>

                                        <Field name="price">
                                            <CurrencyInput>
                                                <NumberInput
                                                    label="Price"
                                                    name="price"
                                                    min={0}
                                                    disabled={isClosed}
                                                    prefix="$"
                                                    decimalScale={2}
                                                    decimalSeparator="."
                                                    thousandSeparator=","
                                                    hideControls
                                                />
                                            </CurrencyInput>
                                        </Field>
                                    </Group>
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
                                    {processing ? 'Updating...' : 'Update Snackware'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
