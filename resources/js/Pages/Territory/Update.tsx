import { Actions } from '@/components/Actions';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { ModalContent } from '@/components/ModalContent';
import ModalHeader from '@/components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Select, Stack, TextInput } from '@mantine/core';
import { PencilIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';

interface Operator {
    id: string;
    name: string;
}

interface MerchantAccount {
    id: string;
    provider: string;
    operator_id: string;
}

interface Territory {
    id: string;
    name: string;
    operator_id: string;
    merchant_account_id: string | null;
}

interface UpdateProps {
    territory: Territory;
    operators: Operator[];
    merchant_accounts: MerchantAccount[];
}

export default function Update({ territory, operators, merchant_accounts }: UpdateProps) {
    const modal = useModal();
    const form = useForm({
        name: territory.name,
        operator_id: territory.operator_id,
        merchant_account_id: territory.merchant_account_id,
    });

    const { processing, setData } = form;

    useEffect(() => {
        if (!form.data.merchant_account_id) {
            return;
        }

        const isValid = merchant_accounts.some(
            (account) =>
                account.id === form.data.merchant_account_id &&
                account.operator_id === form.data.operator_id
        );

        if (!isValid) {
            setData('merchant_account_id', null);
        }
    }, [form.data.operator_id, form.data.merchant_account_id, merchant_accounts, setData]);

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
            <Head title={`Update Territory: ${territory.name}`} />
            <Modal size="lg">
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Update territory"
                        description={
                            <>
                                You are updating: <strong>{territory.name}</strong>
                            </>
                        }
                        icon={<PencilIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('territories.update', territory.id),
                                method: 'post',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack gap="md">
                                    <Field name="name">
                                        <TextInput
                                            label="Name"
                                            name="name"
                                            placeholder="Enter territory name"
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
                                    Update Territory
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
