import { Actions } from '@/Components/Actions';
import { Modal } from '@/Components/Modal';
import ModalHeader from '@/Components/ModalHeader';
import { useModal } from '@inertiaui/modal-react';
import { Button } from '@mantine/core';
import { ShieldPlusIcon } from 'lucide-react';

export default function NearbyPlacement() {
    const modal = useModal();

    return (
        <>
            <Modal>
                <ModalHeader
                    hero
                    title="Placement"
                    description="Add a new role to the system"
                    icon={<ShieldPlusIcon className="size-6" />}
                    color="blue"
                />

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
                </Actions>
            </Modal>
        </>
    );
}
