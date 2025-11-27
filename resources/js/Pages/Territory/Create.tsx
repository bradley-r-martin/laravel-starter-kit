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
import { MapPinPlusIcon } from 'lucide-react';
import { useMemo } from 'react';


interface CreateProps {
    operators: Models.Operator[];
    merchant_accounts: Models.MerchantAccount[];
}

export default function Create({ operators, merchant_accounts }: CreateProps) {
    const modal = useModal();
    const form = useForm({
        operator_id: '',
        merchant_account_id: null as string | null,
        name: '',
    });

    const { processing } = form;

    const merchantAccountOptions = useMemo(() => {
        const filtered = form.data.operator_id
            ? merchant_accounts.filter((account) => account.operator_id === form.data.operator_id)
            : merchant_accounts;

        return filtered.map((account) => ({
            value: account.id,
            label: account.provider,
        }));
    }, [form.data.operator_id, merchant_accounts]);

    return (
        <>
            <Head title="Create Territory" />
            <Modal size="lg">
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Create territory"
                        description="Add a new territory to the system"
                        icon={<MapPinPlusIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('territories.store'), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack gap="md">
                                    <Field name="name">
                                        <TextInput
                                            label="Name"
                                            name="name"
                                            placeholder="Enter territory name"
                                            autoFocus
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

                                    <Field name="merchant_account_id" type="select">
                                        <Select
                                            label="Merchant Account"
                                            name="merchant_account_id"
                                            placeholder="Select merchant account"
                                            data={merchantAccountOptions}
                                            searchable
                                            clearable
                                            disabled={merchantAccountOptions.length === 0}
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
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" loading={processing}>
                                    Create Territory
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
