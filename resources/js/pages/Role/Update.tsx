import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { TransferInput, TransferItem } from '@/components/TransferInput';
import { Head, useForm } from '@inertiajs/react';
import { Modal, useModal } from '@inertiaui/modal-react';
import {
    Alert,
    Anchor,
    Button,
    Checkbox,
    Group,
    Stack,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core';
import { AlertCircleIcon } from 'lucide-react';

interface Role {
    id: string;
    name: string;
    description: string | null;
    hidden: boolean;
    closed_at: string | null;
    policies: string[];
}

interface Props {
    role: Role;
    availablePolicies: TransferItem[];
}

export default function Update({ role, availablePolicies }: Props) {
    const modal = useModal();
    const isClosed = !!role.closed_at;

    const form = useForm({
        name: role.name || '',
        description: role.description || '',
        hidden: role.hidden || false,
        policies: role.policies || ([] as string[]),
    });

    const { processing } = form;

    return (
        <>
            <Head title={`Update Role: ${role.name}`} />
            <Modal>
                <Title order={2} mb="lg">
                    Update Role
                </Title>

                {isClosed && (
                    <Alert
                        variant="light"
                        color="red"
                        icon={<AlertCircleIcon className="size-5" />}
                        title="Cannot Update Role"
                        mb="lg"
                    >
                        This role is closed and cannot be updated.
                    </Alert>
                )}

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('roles.update', role.id), method: 'put' }}
                        onSuccess={() => modal?.close()}
                    >
                        <Stack gap="md">
                            <Field name="name">
                                <TextInput label="Name" name="name" disabled={isClosed} />
                            </Field>

                            <Field name="description">
                                <Textarea
                                    label="Description"
                                    name="description"
                                    rows={4}
                                    disabled={isClosed}
                                />
                            </Field>

                            <Field name="hidden" type="checkbox">
                                <Checkbox label="Hidden" name="hidden" disabled={isClosed} />
                            </Field>

                            <Field name="policies">
                                <TransferInput
                                    className="max-h-[300px]"
                                    label="Policies"
                                    items={availablePolicies}
                                    disabled={isClosed}
                                />
                            </Field>

                            <Group justify="flex-end" mt="md">
                                <Anchor onClick={() => modal?.close()} type="button" c="dimmed">
                                    Cancel
                                </Anchor>
                                <Button type="submit" loading={processing} disabled={isClosed}>
                                    {processing ? 'Updating...' : 'Update Role'}
                                </Button>
                            </Group>
                        </Stack>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
