import { Actions } from '@/Components/Actions';
import Cast from '@/Components/Cast';
import Data from '@/Components/Data/Data';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import CurrencyInput from '@/Components/Inputs/CurrencyInput/CurrencyInput';
import { TransferInput } from '@/Components/Inputs/TransferInput';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import { AlertCircleIcon, PackageIcon } from 'lucide-react';

interface Snackware {
    id: string;
    name: string;
    type: string;
    icon: string | null;
    price: number;
    closed_at: string | null;
    products: string[];
}

interface Props {
    snackware: Snackware;
}

export default function Update({ snackware }: Props) {
    const modal = useModal();
    const isClosed = !!snackware.closed_at;

    const form = useForm({
        name: snackware.name || '',
        type: snackware.type || 'box',
        icon: snackware.icon || null,
        price: snackware.price || 0,
        products: snackware.products || ([] as string[]),
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Update Snackware: ${snackware.name}`} />
            <Modal size="lg">
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
                                        <Field name="type">
                                            <TextInput
                                                label="Type"
                                                name="type"
                                                disabled={isClosed}
                                            />
                                        </Field>

                                        <Field name="price">
                                            <CurrencyInput>
                                                <NumberInput
                                                    label="Price (cents)"
                                                    name="price"
                                                    min={0}
                                                    disabled={isClosed}
                                                    prefix="$"
                                                    decimalScale={2}
                                                    decimalSeparator="."
                                                    thousandSeparator=","
                                                />
                                            </CurrencyInput>
                                        </Field>
                                    </Group>

                                    <Field name="products" type="transfer">
                                        <Data parameter="availableProducts" property="items">
                                            <TransferInput
                                                label="Products"
                                                className="max-h-[300px]"
                                                disabled={isClosed}
                                                renderItem={(item) => (
                                                    <span className="flex w-full flex-1 items-center justify-between space-x-2">
                                                        <span>{item.label}</span>
                                                        <span className="text-xs text-zinc-500">
                                                            <Cast.Currency>
                                                                {item.__cost_per_unit}
                                                            </Cast.Currency>
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
