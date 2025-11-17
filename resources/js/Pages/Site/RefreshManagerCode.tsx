import { Actions } from '@/Components/Actions';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button, Stack, Text } from '@mantine/core';
import { AlertCircleIcon, RefreshCcw } from 'lucide-react';

interface Site {
    id: string;
    name: string;
    manager_code: string | null;
}

interface Props {
    site: Site;
}

export default function RefreshManagerCode({ site }: Props) {
    const modal = useModal();

    const form = useForm({});

    const { processing } = form;

    return (
        <>
            <Head title={`Refresh Manager Code: ${site.name}`} />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Refresh manager code"
                        description={
                            <>
                                Generate a new manager code for site: <strong>{site.name}</strong>
                            </>
                        }
                        icon={<RefreshCcw className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('sites.refresh-manager-code', site.id),
                                method: 'post',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack gap="md">
                                    <Alert
                                        variant="light"
                                        color="blue"
                                        icon={<AlertCircleIcon className="size-5" />}
                                    >
                                        <Text size="sm">
                                            This will generate a new 4-digit manager code. The current
                                            code{' '}
                                            {site.manager_code ? (
                                                <strong>{site.manager_code}</strong>
                                            ) : (
                                                '(not set)'
                                            )}{' '}
                                            will be replaced.
                                        </Text>
                                    </Alert>
                                    <Text size="sm" c="dimmed">
                                        Are you sure you want to refresh the manager code?
                                    </Text>
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
                                <Button type="submit" loading={processing} color="blue">
                                    {processing ? 'Refreshing...' : 'Refresh Manager Code'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}

