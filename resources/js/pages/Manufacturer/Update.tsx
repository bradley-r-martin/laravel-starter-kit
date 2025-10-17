import { Actions } from '@/components/Actions';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { ModalContent } from '@/components/ModalContent';
import ModalHeader from '@/components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Stack, TextInput } from '@mantine/core';
import { PencilIcon } from 'lucide-react';

interface Manufacturer {
    id: string;
    name: string;
}

interface UpdateProps {
    manufacturer: Manufacturer;
}

export default function Update({ manufacturer }: UpdateProps) {
    const modal = useModal();
    const form = useForm({
        name: manufacturer.name,
    });
    const { processing } = form;

    return (
        <>
            <Head title={`Update Manufacturer: ${manufacturer.name}`} />
            <Modal>
                <ModalHeader
                    hero
                    title="Update manufacturer"
                    description={
                        <>
                            You are updating: <strong>{manufacturer.name}</strong>
                        </>
                    }
                    icon={<PencilIcon className="size-6" />}
                    color="blue"
                />

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{
                            url: route('manufacturers.update', manufacturer.id),
                            method: 'post',
                        }}
                        onSuccess={() => modal?.close()}
                    >
                        <ModalContent>
                            <Stack>
                                <Field name="name">
                                    <TextInput
                                        label="Name"
                                        name="name"
                                        placeholder="Enter manufacturer name"
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
                                {processing ? 'Updating...' : 'Update Manufacturer'}
                            </Button>
                        </Actions>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
