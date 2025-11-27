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
import { Button, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { PackagePlusIcon } from 'lucide-react';

interface CreateProps {}

export default function Create({}: CreateProps) {
    const modal = useModal();
    const form = useForm({
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
                                        <TextInput label="Name" name="name" autoFocus />
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
                                <Button type="submit" loading={processing}>
                                    Create
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
