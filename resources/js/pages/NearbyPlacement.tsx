import { Actions } from '@/components/Actions';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { ModalContent } from '@/components/ModalContent';
import ModalHeader from '@/components/ModalHeader';
import { TransferInput } from '@/components/TransferInput';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Checkbox, Textarea, TextInput } from '@mantine/core';
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
